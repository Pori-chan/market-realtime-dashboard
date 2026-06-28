import { mockMarketData } from "../data/mockMarketData";
import type { MarketData } from "../types/market";
import { updateRandomMarketItems } from "../utils/marketUpdater";
import { type MarketDataListener, type MarketDataProvider } from "./marketDataProvider";

const UPDATE_INTERVAL_MS = 10;
const UPDATE_COUNT_PER_TICK = 100;

let timerId: number | null = null;

function startMockMarketDataFeed(): void {
    if (timerId != null) {
        return;
    }
    timerId = window.setInterval(() => {
        updateMockMarketData(UPDATE_COUNT_PER_TICK);
    }, UPDATE_INTERVAL_MS);
}

function stopMockMarketDataFeed(): void {
    if (timerId == null) {
        return;
    }
    clearInterval(timerId);
    timerId = null;
}


let marketData: MarketData[] = mockMarketData;

let listeners = new Set<MarketDataListener>();

export function subscribeMarketData(callback: MarketDataListener): () => void {
    listeners.add(callback);
    startMockMarketDataFeed();

    return () => {
        listeners.delete(callback);
        if (listeners.size == 0) {
            stopMockMarketDataFeed();
        }
    };
}

export function getInitialMarketData(): MarketData[] {
    return marketData;
}

function updateMockMarketData(updateCount: number): void {
    marketData = updateRandomMarketItems(marketData, updateCount);
    listeners.forEach((listener) => {
        listener(marketData);
    })
}

export const mockMarketDataProvider: MarketDataProvider = { getInitialMarketData, subscribe: subscribeMarketData, };