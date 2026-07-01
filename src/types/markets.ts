export type MarketTrend = "up" | "down" | "flat";
export type SortKey = "symbol" | "price" | "changePercent";

export type Market = {
    symbol: string;
    basePrice: number;
    price: number;
    changePercent: number;
    flash: "up" | "down" | null;
    flashKey: number;
    history: number[];
    chartHistory:number[];
    trend: MarketTrend;
};