import type { Language } from "../types/language";
import type { MarketSessionInfo } from "../utils/usMarketHours";
import { formatCountdown } from "../utils/usMarketHours";

type HeaderProps = {
    connected: boolean;
    language: Language;
    onLanguageChange: (language: Language) => void;
    t: Record<string, string>;
    marketSession: MarketSessionInfo;
}

export function Header({ connected, language, onLanguageChange, t, marketSession }: HeaderProps) {
    return (
        <header className="header">
            <h1>💹 {t.title}</h1>

            <div className="market-session">
                {marketSession.isOpen
                    ? `${t.opening}`
                    : `${t.nextOpen} ${formatCountdown(marketSession.nextOpenAt)}`}
            </div>

            <div className="header-actions">
                <div className={connected ? "status connected" : "status disconnected"} >
                    ● {connected ? t.connected : t.disconnected}
                </div>

                <select
                    value={language}
                    onChange={(event) => onLanguageChange(event.target.value as Language)}
                    className="language-select"
                    aria-label={t.language}
                >
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                </select>
            </div>
        </header >
    );
}