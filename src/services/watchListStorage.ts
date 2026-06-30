import { defaultSymbols } from "../data/watchList";

const STORAGE_KEY = "live-market-dashboard-symbols"

export function loadSymbols(): string[] {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultSymbols;

    try {
        const symbols = JSON.parse(saved);

        if (!Array.isArray(symbols)) return defaultSymbols

        return symbols.filter((symbol) => typeof symbol === "string");
    } catch {
        return defaultSymbols;
    }
}

export function saveSymbols(symbols: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
}

export function resetSymbols(): string[] {
    localStorage.removeItem(STORAGE_KEY);
    return defaultSymbols;
}