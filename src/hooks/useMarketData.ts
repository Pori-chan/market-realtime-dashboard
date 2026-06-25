import { useEffect, useState } from "react";
import { getInitialMarketData, subscribeMarketData, updateMockMarketData } from "../providers/MockMarketDataProvider";
import type { MarketData } from "../types/market";



export function useMarketData(): MarketData[] {
    const [marketData, setMarketData] = useState<MarketData[]>(getInitialMarketData);

    useEffect(() => {
        const unsubscribe = subscribeMarketData(setMarketData);

        return () => {
            unsubscribe();
        };
    }, []);

    return marketData;
}