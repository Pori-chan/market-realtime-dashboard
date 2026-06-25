import { Header } from "./components/Header";
import { MarketTable } from "./components/MarketTable";
import { StatsPanel } from "./components/StatsPanel";
import { useEffect,useState } from "react";
import { mockMarketData } from "./data/mockMarketData";

function App() {
  const [marketData, setMarketData] = useState(mockMarketData);
  useEffect(()=>{
    const timer = setInterval(()=>{
      setMarketData((currentData)=>{

        const updatedData = currentData.map((item)=>({
          ...item,
          price:Number((item.price+(Math.random()-0.5)*2).toFixed(2)),
        }));

        return updatedData;
      });
    },1000);

    return ()=> clearInterval(timer);
  },[]);

  return (
    <div>
      <Header />
      <MarketTable data={marketData} />
      <StatsPanel />
    </div>
  );
}

export default App;