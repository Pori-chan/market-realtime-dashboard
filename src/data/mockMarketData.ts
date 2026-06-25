import type { MarketData } from "../types/market";

const symbols = ["AAPL","NVDA","TSLA","MSFT"];

export const mockMarketData:MarketData[]=Array.from(
    {length:1000},
    (_,index)=>{
        const baseSymbol = symbols[index% symbols.length];

        return {
            symbol:`${baseSymbol}-${index+1}`,
            price:Number((100+Math.random()*400).toFixed(2)),
            changePercent:0,
            updatedAt:Date.now(),
        };
    }
);