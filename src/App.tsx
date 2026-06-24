import { Header } from "./components/Header";
import { MarketTable } from "./components/MarketTable";
import { StatsPanel } from "./components/StatsPanel";

function App() {
  return (
    <div>
      <Header/>
      <MarketTable/>
      <StatsPanel/>
    </div>
  );
}

export default App;