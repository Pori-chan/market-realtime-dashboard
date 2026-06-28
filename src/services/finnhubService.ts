const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export function connectFinnhub(): WebSocket {
    return new WebSocket(
        `wss://ws.finnhub.io?token=${API_KEY}`
    );
}

export async function fetchUsMarketStatus() {
    const response = await fetch(
        `https//finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch market status");
    }

    return response.json();
}