
type StatsPanelProps = {
    title: string;
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
            <h2>{props.title}</h2>

            <div className="stats-grid">
                <span>Connection</span>
                <strong>{props.connected ? "🟢 connected" : "🔴 Disconnected"}</strong>

                <span>Market</span>
                <strong>{props.marketOpen ? "🟢 Open" : "🔴 Closed"}</strong>

                <span>Demo</span>
                <strong>{props.demoMode ? "🟡 Enabled" : "⚪ Disabled"}</strong>

                <span>Total Trades</span>
                <strong>{props.totalTrades}</strong>

                <span>Displayed</span>
                <strong>{props.displayedTrades}</strong>

                <span>Watch List</span>
                <strong>{props.watchListCount}</strong>

                <span>Uptime</span>
                <strong>{props.uptime}</strong>

                <span>Next Open</span>
                <strong>{props.nextOpenCountdown}</strong>
            </div>
        </section>
    );
}