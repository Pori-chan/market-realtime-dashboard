import { Header } from "./components/Header";
import { StatsPanel } from "./components/StatsPanel";
import { TradeStream } from "./components/TradeStream";
import { WatchList } from "./components/WatchList";

function App(){
  return(
    <>
      <Header />

      <main>
        <WatchList/>
        <TradeStream/>
        <StatsPanel/>
      </main>
    </>
  )
}

export default App;