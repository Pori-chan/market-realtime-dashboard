import { Header } from "./components/Header";
import { MarketTable } from "./components/MarketTable";
import { StatsPanel } from "./components/StatsPanel";
import { useMarketData } from "./hooks/useMarketData";

function App() {
  console.count("App rendered");

  const marketData = useMarketData();

  return (
    <>
      <Header />
      <MarketTable data={marketData} />
      <StatsPanel />
    </>
  );
}

export default App;