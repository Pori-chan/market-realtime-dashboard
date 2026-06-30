import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { StatsPanel } from "./components/StatsPanel";
import { TradeStream } from "./components/TradeStream";
import { WatchList } from "./components/WatchList";
import { messages } from "./i18n/messages";
import { connectFinnhub } from "./services/finnhubService";
import type { FinnhubMessage } from "./types/finnhub";
import type { Language } from "./types/language";
import type { Market } from "./types/markets";
import type { Trade } from "./types/trade";
import { generateMockTrade } from "./utils/mockTrade";
import { formatDuration } from "./utils/time";
import { formatCountdown, getUsMarketSessionInfo } from "./utils/usMarketHours";
import { initializeMarkets } from "./services/marketInitializer";
import type { FinnhubSymbolSearchResult } from "./types/finnhub";
import { fetchQuote, searchSymbols } from "./services/finnhubService";


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
  const t = messages[language];

    async function handleAddSymbol(symbol: string) {
    if (markets.some((market) => market.symbol === symbol)) {
      return;
    }

    const quote = await fetchQuote(symbol);

    const basePrice = quote.pc;
    const price = quote.c;
    const changePercent = basePrice === 0 ? 0 : ((price - basePrice) / basePrice) * 100;

    setMarkets((currentMarkets) => [
      ...currentMarkets,
      {
        symbol,
        basePrice,
        price,
        changePercent: Number(changePercent.toFixed(2)),
        flash: null,
        flashKey: 0,
        history: [price],
        trend: changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat",
      },
    ]);

    setSearchQuery("");
    setSearchResults([]);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setMarketSession(getUsMarketSessionInfo());
    }, 1000);

    return () => clearInterval(timer);
  }, [])

  useEffect(() => {
    initializeMarkets()
      .then((initialMarkets) => {
        setMarkets(initialMarkets);
      })
      .catch((error) => {
        console.error("Failed to initialize markets", error);
      });
  }, []);

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
            trend,
          };
        });
      });

    }, 500);

    return () => clearInterval(timer);
  }, [marketSession.isOpen, demoMode])

  useEffect(() => {
    const socket = connectFinnhub();

    socket.onopen = () => {
      setConnected(true);

      ["AAPL", "MSFT", "NVDA", "TSLA", "META"].forEach((symbol) => {
        socket.send(JSON.stringify({ type: "subscribe", symbol, }));
      });
    };

    socket.onclose = () => {
      setConnected(false);
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
              trend,
            };
          });
        });
      }
    };

    return () => {
      socket.close();
    };

  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchSymbols(searchQuery)
        .then((response) => setSearchResults(response.result))
        .catch((error) => console.error("Failed to search symbols", error));
    }, 300);
  })

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
          title={t.watchList}
          markets={markets}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSearchQueryChange={setSearchQuery}
          onAddSymbol={handleAddSymbol}
        />
        <TradeStream title={t.tradeStream} trades={trades} />
        <StatsPanel
          title={t.statistics}

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