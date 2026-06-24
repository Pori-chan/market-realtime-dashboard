import { Header } from "./components/Header";
import { MarketTable } from "./components/MarketTable";
import { StatsPanel } from "./components/StatsPanel";
import { useState } from "react";
import { mockMarketData } from "./data/mockMarketData";

function App() {
  const [marketData, setMarketData] = useState(mockMarketData);

  return (
    <div>
      <Header />
      <MarketTable data={marketData} />
      <StatsPanel />
    </div>
  );
}

export default App;