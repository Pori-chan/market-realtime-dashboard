import { Header } from "./components/Header";
import { StatsPanel } from "./components/StatsPanel";
import { TradeStream } from "./components/TradeStream";
import { WatchList } from "./components/WatchList";
import { useEffect, useState } from "react";
import { connectFinnhub } from "./services/finnhubService";
import type { FinnhubMessage } from "./types/finnhub";
import type { Trade } from "./types/trade";


function App() {
  const [connected, setConnected] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);

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
      }
    };

    return () => {
      socket.close();
    };

  }, []);
  return (
    <>
      <Header connected={connected} />

      <main className="dashboard">
        <WatchList />
        <TradeStream trades={trades}/>
        <StatsPanel />
      </main>
    </>
  )
}

export default App;