export type Market = {
    symbol: string;
    basePrice: number;
    price: number;
    changePercent: number;
    flash: "up" | "down" | null;
};