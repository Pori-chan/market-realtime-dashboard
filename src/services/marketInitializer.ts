import { watchSymbols } from "../data/watchList";
import { fetchQuote } from "./finnhubService";
import type { Market, MarketTrend } from "../types/markets";

export async function initializeMarkets(): Promise<Market[]> {
    const markets = await Promise.all(
        watchSymbols.map(async (symbol) => {
            const quote = await fetchQuote(symbol);

            const basePrice = quote.pc;
            const price = quote.c;
            const changePercent =
                basePrice === 0 ? 0 : ((price - basePrice) / basePrice) * 100;
            const trend: MarketTrend = changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat";

            return {
                symbol,
                basePrice,
                price,
                changePercent: Number(changePercent.toFixed(2)),
                flash: null,
                flashKey: 0,
                history: [price],
                trend: trend,
            };
        })
    );

    return markets;
}
