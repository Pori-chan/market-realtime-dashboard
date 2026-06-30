import { type Translation } from "../i18n/types";

type StatsPanelProps = {
    t:Translation;
    connected: boolean;
    demoMode: boolean;
    marketOpen: boolean;

    totalTrades: number;
    displayedTrades: number;
    watchListCount: number;

    uptime: string;
    nextOpenCountdown: string;
};

export function StatsPanel(props: StatsPanelProps) {
    return (
        <section className="panel">
            <h2>{props.t.statistics}</h2>

            <div className="stats-grid">
                <span>{props.t.connection}</span>
                <strong>{props.connected ? `🟢 ${props.t.connected}` : `🔴 ${props.t.disconnected}`}</strong>

                <span>{props.t.market}</span>
                <strong>{props.marketOpen ? `🟢 ${props.t.opened}` : `🔴 ${props.t.closed}`}</strong>

                <span>{props.t.demo}</span>
                <strong>{props.demoMode ? `🟡 ${props.t.enabled}` : `⚪ ${props.t.disabled}`}</strong>

                <span>{props.t.totalTrades}</span>
                <strong>{props.totalTrades}</strong>

                <span>{props.t.displayed}</span>
                <strong>{props.displayedTrades}</strong>

                <span>{props.t.watchList}</span>
                <strong>{props.watchListCount}</strong>

                <span>{props.t.uptime}</span>
                <strong>{props.uptime}</strong>

                <span>{props.t.nextOpen}</span>
                <strong>{props.nextOpenCountdown}</strong>
            </div>
        </section>
    );
}