import { useEffect, useState, useRef, useMemo } from "react";
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
import { formatDuration } from "./utils/time";
import { formatCountdown, getUsMarketSessionInfo } from "./utils/usMarketHours";
import { loadSymbols, resetSymbols, saveSymbols } from "./services/watchListStorage";
import { defaultSymbols } from "./data/watchList";
import { LargetChart } from "./components/LargetChart";


function App() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [language, setLanguage] = useState<Language>("ja");
  const [marketSession, setMarketSession] = useState(getUsMarketSessionInfo());
  const [demoMode, setDemoMode] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [startTime] = useState(() => Date.now());
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

  const selectedMarket = markets.find((market) => market.symbol === selectedSymbol) ?? null;

  function sendSocketMessage(message: object): void {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(message));
  }

  function subscribeToSymbol(symbol: string): void {
    sendSocketMessage({ type: "subscribe", symbol });
  }

  function unsubscribeFromSymbol(symbol: string): void {
    sendSocketMessage({ type: "unsubscribe", symbol });
  }

  async function handleAddSymbol(symbol: string) {
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
  }

  function handleRemoveSymbol(symbol: string) {
    setMarkets((currentMarkets) =>
      currentMarkets.filter((market) => market.symbol !== symbol)
    );

    const socket = socketRef.current;

    if (socket && socket.readyState === WebSocket.OPEN) {
      unsubscribeFromSymbol(symbol);
    }
  }

  async function handleResetSymbols() {
    const symbols = resetSymbols();
    const initialMarkets = await initializeMarkets(symbols);
    setMarkets(initialMarkets);
  }

  function handleSelectSymbol(symbol: string) {
    setSelectedSymbol((currentSelected) =>
      currentSelected === symbol ? null : symbol
    );
  }

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

          const previousPrice = market.price;
          const nextPrice = mockTrade.price;
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
            chartHistory: [...market.chartHistory, nextPrice].slice(-100),
            trend,
          };
        });
      });

    }, 500);

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
          return currentMarkets.map((market) => {
            const latestTrade = newTrades.find(
              (trade) => trade.symbol === market.symbol
            );

            if (!latestTrade) return market;

            const previousPrice = market.price;
            const nextPrice = latestTrade.price;
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
              chartHistory: [...market.chartHistory, nextPrice].slice(-100),
              trend,
            };
          });
        });
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };

  }, []);

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
          connected={connected}
          demoMode={demoMode}
          marketOpen={marketSession.isOpen}

          totalTrades={trades.length}
          displayedTrades={trades.length}

          watchListCount={markets.length}

          uptime={formatDuration(now - startTime)}
          nextOpenCountdown={formatCountdown(
            marketSession.nextOpenAt
          )}
        />
      </main>
    </>
  )
}

export default App;