import type { Market } from "../types/markets";

type LargetChartProps = {
    market: Market | null;
};

export function LargetChart({ market }: LargetChartProps) {
    const width = 720;
    const height = 180;
    const padding = 16;

    if (!market) {
        return null
    }

    const values = market.chartHistory;

    if (values.length < 2) {
        return (
            <section className="large-chart">
                <div className="lar-ge-chart-header">
                    <div>
                        <h2>{market.symbol}</h2>
                        <span>Waiting for price update...</span>
                    </div>
                </div>
            </section>
        );
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((value, index) => {
        const x = padding + (index / (values.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((value - min) / range) * (height - 2 * padding);

        return `${x},${y}`;
    })
        .join(" ");

    return (
        <section className="large-chart">
            <div className="large-chart-header">
                <div>
                    <h2>{market.symbol}</h2>
                    <span>{market.price.toFixed(2)} / {market.changePercent.toFixed(2)}%</span>
                </div>
            </div>
            <div className="large-chart-body">
                <svg
                    className={`large-chart-svg sparkline-${market.trend}`}
                    viewBox={`0 0 ${width} ${height}`}
                >
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                </svg>

                <div className="chart-scale">
                    <span>{`$${max.toFixed(2)}`}</span>
                    <span>{`$${((max + min) / 2).toFixed(2)}`}</span>
                    <span>{`$${min.toFixed(2)}`}</span>
                </div>
            </div>

        </section>
    );
}