export type FinnhubPingMessage = {
    type: "ping";
};

export type FinnhubTradeMessage = {
    type: "trade";
    data: FinnhubTrade[];
};

export type FinnhubTrade = {
    p: number;//price
    s: string;//symbol
    t: number;//timestamp
    v: number;//volume
};

export type FinnhubMessage = FinnhubPingMessage | FinnhubTradeMessage;

export type FinnhubQuote = {
    c: number; //current price
    pc: number; //previous close
};

export type FinnhubSymbolSearchResult = {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
};

export type FinnhubSymbolSearchResonse = {
    count: number;
    result: FinnhubSymbolSearchResult[];
}