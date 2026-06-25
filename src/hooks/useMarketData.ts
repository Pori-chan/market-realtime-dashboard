import { useEffect, useState } from "react";
import { getInitialMarketData, updateMockMarketData } from "../providers/MockMarketDataProvider";
import type { MarketData } from "../types/market";


export function useMarketData(): MarketData[] {
    const [marketData, setMarketData] = useState<MarketData[]>(getInitialMarketData);

    useEffect(() => {
        const timer = setInterval(() => {
            setMarketData(updateMockMarketData(10));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return marketData;
}