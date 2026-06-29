import type { Trade } from "../types/trade";

const symbols = ["AAPL","MSFT","NVDA","TSLA","META"];

export function generateMockTrade():Trade{
    const symbol = symbols[Math.floor(Math.random()*symbols.length)];
    const price = 100+Math.random()*500;
    const volume = Math.floor(1+Math.random()*500);

    return {
        id:crypto.randomUUID(),
        symbol,
        price:Number(price.toFixed(2)),
        volume,
        timestamp:Date.now(),
    };
}