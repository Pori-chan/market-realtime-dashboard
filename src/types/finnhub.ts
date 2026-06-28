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