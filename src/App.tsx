import { Header } from "./components/Header";
import { StatsPanel } from "./components/StatsPanel";
import { TradeStream } from "./components/TradeStream";
import { WatchList } from "./components/WatchList";
import { useEffect, useState } from "react";
import { connectFinnhub } from "./services/finnhubService";

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = connectFinnhub();

    socket.onopen = () => {
      setConnected(true);
    };
    socket.onclose = () => {
      setConnected(false);
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
        <TradeStream />
        <StatsPanel />
      </main>
    </>
  )
}

export default App;