import { Header } from "./components/Header";
import { MarketTable } from "./components/MarketTable";
import { StatsPanel } from "./components/StatsPanel";
import { useEffect, useState } from "react";
import { mockMarketData } from "./data/mockMarketData";
import { updateRandomMarketItems } from "./utils/marketUpdater";

function App() {
  console.count("App rendered");
  const [marketData, setMarketData] = useState(mockMarketData);
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketData((currentData) => {
        return updateRandomMarketItems(currentData,10);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Header />
      <MarketTable data={marketData} />
      <StatsPanel />
    </div>
  );
}

export default App;