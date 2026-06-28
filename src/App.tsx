import { Header } from "./components/Header";
import { StatsPanel } from "./components/StatsPanel";
import { TradeStream } from "./components/TradeStream";
import { WatchList } from "./components/WatchList";
import { useEffect, useState } from "react";
import { connectFinnhub } from "./services/finnhubService";
import type { FinnhubMessage } from "./types/finnhub";
import type { Trade } from "./types/trade";
import type { Language } from "./types/language";
import { messages } from "./i18n/messages";
import { getUsMarketSessionInfo } from "./utils/usMarketHours";
import { generateMockTrade } from "./utils/mockTrade";
import type { Market } from "./types/markets";
import { watchList } from "./data/watchList";


function App() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [language, setLanguage] = useState<Language>("ja");
  const [marketSession, setMarketSession] = useState(getUsMarketSessionInfo());
  const [demoMode, setDemoMode] = useState(false);
  const [markets, setMarkets] = useState<Market[]>(watchList);
  const t = messages[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setMarketSession(getUsMarketSessionInfo());
    }, 1000);

    return () => clearInterval(timer);
  })

  useEffect(() => {
    if (marketSession.isOpen || !demoMode) return;

    const timer = setInterval(() => {
      const mockTrade = generateMockTrade();

      setTrades((currentTrades) => {
        return [mockTrade, ...currentTrades].slice(0, 100);
      });

       setMarkets((currentMarkets) => {
          return currentMarkets.map((market) => {
            if(market.symbol !== mockTrade.symbol) return market;

            const previousPrice = market.price;
            const nextPrice = mockTrade.price;
            const nextChangePercent = ((nextPrice - previousPrice) / previousPrice) * 100;

            return {
              ...market,
              price: nextPrice,
              changePercent: Number(nextChangePercent.toFixed(2)),
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
          id: `${trade.s}-${trade.t}-${trade.p}-${trade.v}`,
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
            const nextChangePercent = ((nextPrice - previousPrice) / previousPrice) * 100;

            return {
              ...market,
              price: nextPrice,
              changePercent: Number(nextChangePercent.toFixed(2)),
            };
          });
        });
      }
    };

    return () => {
      socket.close();
    };

  }, []);
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
        <WatchList title={t.watchList} markets={markets}/>
        <TradeStream title={t.tradeStream} trades={trades} />
        <StatsPanel title={t.statistics} />
      </main>
    </>
  )
}

export default App;