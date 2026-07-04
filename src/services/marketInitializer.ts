import type { FinnhubQuote } from "../types/finnhub";
import type { Market, MarketTrend } from "../types/markets";
import { fetchQuote } from "./finnhubService";

export async function initializeMarkets(symbols: string[]): Promise<Market[]> {
    const markets = await Promise.all(
        symbols.map(async (symbol) => {
            const quote = await fetchQuote(symbol);
            return createMarketFromQuote(symbol, quote);
        })
    );

    return markets;
}

export function createMarketFromQuote(
    symbol: string,
    quote: FinnhubQuote
): Market {
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
        chartHistory: [{price, timestamp: Date.now()}],
        trend,
    };
}

