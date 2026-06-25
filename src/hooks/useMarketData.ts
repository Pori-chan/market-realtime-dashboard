import { useEffect, useState } from "react";
import type { MarketData } from "../types/market";
import { mockMarketData } from "../data/mockMarketData";
import { updateRandomMarketItems } from "../utils/marketUpdater";


export function useMarketData(): MarketData[] {
    const [marketData, setMarketData] = useState<MarketData[]>(mockMarketData);

    useEffect(() => {
        const timer = setInterval(() => {
            setMarketData((currentData) => {
                return updateRandomMarketItems(currentData, 10);
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return marketData;
}