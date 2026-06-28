import type { MarketData } from "../types/market";

export type MarketDataListener = (data: MarketData[]) => void;

export interface MarketDataProvider {
    getInitialMarketData(): MarketData[];

    subscribe(callback: MarketDataListener): () => void;
}