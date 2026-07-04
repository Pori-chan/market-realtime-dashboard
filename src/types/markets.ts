export type MarketTrend = "up" | "down" | "flat";
export type SortKey = "symbol" | "price" | "changePercent";
export type PricePoint = {
    price: number;
    timestamp: number;
};

export type Market = {
    symbol: string;
    basePrice: number;
    price: number;
    changePercent: number;
    flash: "up" | "down" | null;
    flashKey: number;
    history: number[];
    chartHistory:PricePoint[];
    trend: MarketTrend;
};