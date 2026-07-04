export type Language = "ja" | "en";

export type Translation = {
    title: string;
    watchList: string;
    tradeStream: string;
    statistics: string;
    connected: string;
    disconnected: string;
    language: string;
    opening: string;
    nextOpen: string;
    demoRunning: string;
    demoOff: string;
    searchSymbol: string;
    addSymbolError: (symbol: string) => string;
    removeSymbol: (symbol: string) => string;
    resetWatchList: string;
    symbol: string;
    price: string;
    changePercent: string;
    tradesPerMinute: string;
    mostActive: string;
    topGainer: string;
    topLoser: string;
    avgTradeSize: string;
    lastTrade: string;
    watchListCount: string;
};
