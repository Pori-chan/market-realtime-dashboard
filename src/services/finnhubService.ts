const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export function connectFinnhub(): WebSocket {
    return new WebSocket(
        `wss://ws.finnhub.io?token=${API_KEY}`
    );
}