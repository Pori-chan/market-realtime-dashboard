import { mockMarketData } from "../data/mockMarketData";
import type { MarketData } from "../types/market";
import { updateRandomMarketItems } from "../utils/marketUpdater";


let marketData: MarketData[] = mockMarketData;

export function getInitialMarketData(): MarketData[] {
    return marketData;
}

export function updateMockMarketData(updateCount: number): MarketData[] {
    marketData = updateRandomMarketItems(marketData, updateCount);
    return marketData;
}