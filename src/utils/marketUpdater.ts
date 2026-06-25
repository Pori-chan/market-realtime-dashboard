import type { MarketData } from "../types/market";

export function updateRandomMarketItems(
    currentData: MarketData[],
    updateCount: number
): MarketData[] {
    const targetIndexes = new Set<number>();

    while (targetIndexes.size < updateCount) {
        targetIndexes.add(Math.floor(Math.random() * currentData.length));
    }

    return currentData.map((item, index) => {
        if (!targetIndexes.has(index)) {
            return item;
        }

        const priceDiff = (Math.random() - 0.5) * 2;
        const nextPrice = Number((item.price + priceDiff).toFixed(2));
        const nextChangePercent = Number(((priceDiff / item.price) * 100).toFixed(2));

        return {
            ...item,
            price: nextPrice,
            changePercent: nextChangePercent,
            updatedAt: Date.now(),
        };
    });
}