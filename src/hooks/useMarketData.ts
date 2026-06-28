import { useEffect, useState } from "react";
import { mockMarketDataProvider } from "../providers/MockMarketDataProvider";
import type { MarketData } from "../types/market";

export function useMarketData(): MarketData[] {
    const [marketData, setMarketData] = useState(mockMarketDataProvider.getInitialMarketData);

    useEffect(() => {
        const unsubscribe = mockMarketDataProvider.subscribe(setMarketData);

        return () => {
            unsubscribe();
        };
    }, []);

    return marketData;
}