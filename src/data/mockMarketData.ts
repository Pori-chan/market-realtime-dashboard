import type { MarketData } from "../types/market";

export const mockMarketData: MarketData[] = [
    {
        symbol: "AAPL",
        price: 210.15,
        changePercent: 0.52,
        updatedAt: Date.now(),
    },
    {
        symbol: "NVDA",
        price: 1484.30,
        changePercent: 1.23,
        updatedAt: Date.now(),
    },
    {
        symbol: "TSLA",
        price: 320.10,
        changePercent: -0.34,
        updatedAt: Date.now(),
    },
    {
        symbol: "MSFT",
        price: 521.40,
        changePercent: 0.12,
        updatedAt: Date.now(),
    },
]