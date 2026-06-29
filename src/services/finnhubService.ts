import type { FinnhubQuote } from "../types/finnhub";

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export function connectFinnhub(): WebSocket {
    return new WebSocket(
        `wss://ws.finnhub.io?token=${API_KEY}`
    );
}

export async function fetchQuote(symbol: string): Promise<FinnhubQuote> {
    const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch quote:${symbol}`);
    }

    return response.json();
}