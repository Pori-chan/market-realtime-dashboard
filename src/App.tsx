import { Header } from "./components/Header";
import { MarketTable } from "./components/MarketTable";
import { StatsPanel } from "./components/StatsPanel";
import { useEffect, useState } from "react";
import { mockMarketData } from "./data/mockMarketData";

function App() {
  console.count("App rendered");
  const [marketData, setMarketData] = useState(mockMarketData);
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketData((currentData) => {
        const updateCount = 10;
        const targetIndexes = new Set<number>();

        while(targetIndexes.size<updateCount){
          targetIndexes.add(Math.floor(Math.random()*currentData.length));
        }

        return currentData.map((item, index) => {
          if (!targetIndexes.has(index)) {
            return item;
          }

          const priceDiff = (Math.random() - 0.5) * 2;
          const nextPrice = Number((item.price + priceDiff).toFixed(2));
          const nextChangePercent = Number((priceDiff / item.price * 100).toFixed(2));
          0
          return {
            ...item,
            price: nextPrice,
            changePercent: nextChangePercent,
            updateAt: Date.now(),
          };
        });
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