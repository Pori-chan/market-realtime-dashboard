import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { Header } from "./components/Header";
import { StatsPanel } from "./components/StatsPanel";
import { TradeStream } from "./components/TradeStream";
import { WatchList } from "./components/WatchList";
import { messages } from "./i18n/messages";
import { type Language } from "./i18n/types";
import { connectFinnhub, fetchQuote, searchSymbols } from "./services/finnhubService";
import { createMarketFromQuote, initializeMarkets } from "./services/marketInitializer";
import type { FinnhubMessage, FinnhubSymbolSearchResult } from "./types/finnhub";
import type { Market, SortKey } from "./types/markets";
import type { Trade } from "./types/trade";
import { generateMockTrade } from "./utils/mockTrade";
import { getUsMarketSessionInfo } from "./utils/usMarketHours";
import { loadSymbols, resetSymbols, saveSymbols } from "./services/watchListStorage";
import { defaultSymbols } from "./data/watchList";
import { LargetChart } from "./components/LargetChart";

function applyTradeToMarket(market: Market, trade: Trade): Market {
  const previousPrice = market.price;
  const nextPrice = trade.price;
  const nextChangePercent = ((nextPrice - market.basePrice) / market.basePrice) * 100;
  const trend = nextChangePercent > 0
    ? "up"
    : nextChangePercent < 0
      ? "down"
      : "flat";

  return {
    ...market,
    price: nextPrice,
    changePercent: Number(nextChangePercent.toFixed(2)),
    flash: nextPrice >= previousPrice ? "up" : "down",
    flashKey: market.flashKey + 1,
    history: [...market.history, nextPrice].slice(-20),
    chartHistory: [...market.chartHistory,
    {
      price: nextPrice,
      timestamp: trade.timestamp,
    },
    ].slice(-100),
    trend,
  };
}

function App() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [language, setLanguage] = useState<Language>("ja");
  const [marketSession, setMarketSession] = useState(getUsMarketSessionInfo());
  const [demoMode, setDemoMode] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [now, setNow] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FinnhubSymbolSearchResult[]>([]);
  const [addSymbolError, setAddSymbolError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  const t = messages[language];

  const sortedMarkets = useMemo(() => {
    return [...markets].sort((a, b) => {
      if (sortKey === "symbol") {
        return a.symbol.localeCompare(b.symbol);
      }

      if (sortKey === "price") {
        return b.price - a.price;
      }

      return b.changePercent - a.changePercent;
    });
  }, [markets, sortKey]);

  const selectedMarket = useMemo(() => {
    return markets.find((market) => market.symbol === selectedSymbol) ?? null;
  }, [markets, selectedSymbol]);

  const tradesPerMinute = useMemo(() => {
    return trades.filter((trade) => now - trade.timestamp <= 60_000).length;
  }, [now, trades]);

  const mostActiveSymbol = useMemo(() => {
    const tradeCounts = trades.reduce<Record<string, number>>((counts, trade) => {
      counts[trade.symbol] = (counts[trade.symbol] ?? 0) + 1;
      return counts;
    }, {});

    return Object.entries(tradeCounts).reduce(
      (mostActive, [symbol, count]) =>
        count > mostActive.count ? { symbol, count } : mostActive,
      { symbol: "-", count: 0 }
    ).symbol;
  }, [trades]);

  const { topGainer, topLoser } = useMemo(() => {
    return markets.reduce<{
      topGainer: Market | null;
      topLoser: Market | null;
    }>(
      (stats, market) => ({
        topGainer: !stats.topGainer || market.changePercent > stats.topGainer.changePercent
          ? market
          : stats.topGainer,
        topLoser: !stats.topLoser || market.changePercent < stats.topLoser.changePercent
          ? market
          : stats.topLoser,
      }),
      { topGainer: null, topLoser: null }
    );
  }, [markets]);

  const avgTradeSize = useMemo(() => {
    return trades.length > 0
      ? Math.round(trades.reduce((sum, trade) => sum + trade.volume, 0) / trades.length)
      : 0;
  }, [trades]);

  const lastTrade = useMemo(() => trades[0] ?? null, [trades]);

  const sendSocketMessage = useCallback((message: object): void => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(message));
  }, []);

  const subscribeToSymbol = useCallback((symbol: string): void => {
    sendSocketMessage({ type: "subscribe", symbol });
  }, [sendSocketMessage]);

  const unsubscribeFromSymbol = useCallback((symbol: string): void => {
    sendSocketMessage({ type: "unsubscribe", symbol });
  }, [sendSocketMessage]);

  const handleAddSymbol = useCallback(async (symbol: string) => {
    try {
      setAddSymbolError("");

      if (markets.some((market) => market.symbol === symbol)) {
        setSearchQuery("");
        setSearchResults([]);
        return;
      }

      const quote = await fetchQuote(symbol);
      const newMarket = createMarketFromQuote(symbol, quote);
      setMarkets((currentMarkets) => [...currentMarkets, newMarket]);

      const socket = socketRef.current;

      if (socket && socket.readyState === WebSocket.OPEN) {
        subscribeToSymbol(symbol);
      }

      setSearchQuery("");
      setSearchResults([]);

    } catch (error) {
      console.error("Failed to add symbol:", symbol, error);
      setAddSymbolError(t.addSymbolError(symbol))
    }
  }, [markets, subscribeToSymbol, t]);

  const handleRemoveSymbol = useCallback((symbol: string) => {
    setMarkets((currentMarkets) =>
      currentMarkets.filter((market) => market.symbol !== symbol)
    );

    const socket = socketRef.current;

    if (socket && socket.readyState === WebSocket.OPEN) {
      unsubscribeFromSymbol(symbol);
    }
  }, [unsubscribeFromSymbol]);

  const handleResetSymbols = useCallback(async () => {
    const symbols = resetSymbols();
    const initialMarkets = await initializeMarkets(symbols);
    setMarkets(initialMarkets);
  }, []);

  const handleSelectSymbol = useCallback((symbol: string) => {
    setSelectedSymbol((currentSelected) =>
      currentSelected === symbol ? null : symbol
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setMarketSession(getUsMarketSessionInfo());
    }, 1000);

    return () => clearInterval(timer);
  }, [])

  useEffect(() => {
    initializeMarkets(loadSymbols())
      .then((initialMarkets) => {
        setMarkets(initialMarkets);
      })
      .catch((error) => {
        console.error("Failed to initialize markets", error);
      });
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

    saveSymbols(markets.map((market) => market.symbol));
  }, [markets]);

  useEffect(() => {
    if (marketSession.isOpen || !demoMode) return;

    const timer = setInterval(() => {
      const mockTrade = generateMockTrade();

      setTrades((currentTrades) => {
        return [mockTrade, ...currentTrades].slice(0, 100);
      });

      setMarkets((currentMarkets) => {
        return currentMarkets.map((market) => {
          if (market.symbol !== mockTrade.symbol) return market;

          return applyTradeToMarket(market, mockTrade);
        });
      });

    }, 100);

    return () => clearInterval(timer);
  }, [marketSession.isOpen, demoMode])

  useEffect(() => {
    const socket = connectFinnhub();
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);

      defaultSymbols.forEach((symbol) => {
        subscribeToSymbol(symbol);
      });
    };

    socket.onclose = () => {
      setConnected(false);
      socketRef.current = null;
    };

    socket.onmessage = (event) => {
      const message: FinnhubMessage = JSON.parse(event.data);

      if (message.type === "ping") {
        return;
      }

      if (message.type === "trade") {
        const newTrades: Trade[] = message.data.map((trade) => ({
          id: crypto.randomUUID(),
          symbol: trade.s,
          price: trade.p,
          volume: trade.v,
          timestamp: trade.t,
        }));

        setTrades((currentTrades) => {
          return [...newTrades, ...currentTrades].slice(0, 100);
        });

        setMarkets((currentMarkets) => {
          const latestTradeBySymbol = newTrades.reduce<Map<string, Trade>>((tradesBySymbol, trade) => {
            const currentTrade = tradesBySymbol.get(trade.symbol);

            if (!currentTrade || trade.timestamp > currentTrade.timestamp) {
              tradesBySymbol.set(trade.symbol, trade);
            }

            return tradesBySymbol;
          }, new Map());

          return currentMarkets.map((market) => {
            const latestTrade = latestTradeBySymbol.get(market.symbol);

            if (!latestTrade) return market;

            return applyTradeToMarket(market, latestTrade);
          });
        });
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };

  }, [subscribeToSymbol]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchSymbols(searchQuery)
        .then((response) => {
          const filteredResults = response.result.filter((result) => {
            return (
              result.type === "Common Stock" && /^[A-Z]+$/.test(result.symbol)
            );
          });
          setSearchResults(filteredResults);
        })
        .catch((error) => console.error("Failed to search symbols", error));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <Header
        connected={connected}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        marketSession={marketSession}
        demoMode={demoMode}
        onDemoModeChange={setDemoMode}
      />

      <main className="dashboard">
        <WatchList
          t={t}
          markets={sortedMarkets}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSearchQueryChange={setSearchQuery}
          onAddSymbol={handleAddSymbol}
          addSymbolError={addSymbolError}
          onRemoveSymbol={handleRemoveSymbol}
          onResetSymbols={handleResetSymbols}
          sortKey={sortKey}
          onSortKeyChange={setSortKey}
          seledctedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbol}
        />

        <div className={`center-panel ${selectedMarket ? "chart-open" : ""}`}>
          <div className="large-chart-wrapper">
            <LargetChart market={selectedMarket} />
          </div>

          <TradeStream title={t.tradeStream} trades={trades} />
        </div>

        <StatsPanel
          t={t}
          tradesPerMinute={tradesPerMinute}
          mostActiveSymbol={mostActiveSymbol}
          topGainer={topGainer}
          topLoser={topLoser}
          avgTradeSize={avgTradeSize}
          lastTrade={lastTrade}
          watchListCount={markets.length}
        />
      </main>
    </>
  )
}

export default App;
