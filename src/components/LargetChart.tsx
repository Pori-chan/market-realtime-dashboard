import { useState } from "react";
import type { Market, PricePoint } from "../types/markets";

type LargetChartProps = {
    market: Market | null;
};

function formatChartTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}


export function LargetChart({ market }: LargetChartProps) {
    const width = 720;
    const height = 180;
    const padding = 16;

    if (!market) {
        return null
    }

    const history = market.chartHistory;
    const [hoverState, setHoverState] = useState<{
        point: PricePoint;
        x: number;
        y: number;
    } | null>(null);

    if (history.length < 2) {
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

    const values = history.map((point) => point.price);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const middle = (min + max) / 2;
    const range = max - min || 1;

    function priceToY(price: number): number {
        return height - padding - ((price - min) / range) * (height - 2 * padding);
    }

    function indexToX(index: number): number {
        return padding + (index / (history.length - 1)) * (width - 2 * padding);
    }

    const polylinePoints = history
        .map((point, index) => `${indexToX(index)},${priceToY(point.price)}`)
        .join(" ");

    const firstPoint = history[0];
    const middlePoint = history[Math.floor(history.length / 2)];
    const lastPoint = history[history.length - 1];

    const lastIndex = history.length - 1;
    const lastX = indexToX(lastIndex);
    const lastY = priceToY(lastPoint.price);

    return (
        <section className="large-chart">
            <div className="large-chart-header">
                <div>
                    <h2>{market.symbol}</h2>
                    <span>{market.price.toFixed(2)} / {market.changePercent.toFixed(2)}%</span>
                </div>
                <strong
                    className={market.trend === "up" ? "positive" : market.trend === "down" ? "negative" : ""}
                >
                    {market.trend === "up" ? "▲" : market.trend === "down" ? "▼" : "■"}
                </strong>
            </div>

            <div className="large-chart-body">
                <div className="large-chart-main">
                    <svg
                        className={`large-chart-svg sparkline-${market.trend}`}
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="none"
                        onMouseMove={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            const mouseXInSvg = ((event.clientX - rect.left) / rect.width) * width;
                            const chartLeft = padding;
                            const chartRight = width - padding;
                            const chartWidth = chartRight - chartLeft;

                            const ratio = (mouseXInSvg - chartLeft) / chartWidth;
                            const index = Math.round(ratio * (history.length - 1));
                            const safeIndex = Math.max(0, Math.min(history.length - 1, index));

                            const point = history[safeIndex];
                            setHoverState({
                                point,
                                x: indexToX(safeIndex),
                                y: priceToY(point.price),
                            });
                        }}
                        onMouseLeave={() => setHoverState(null)}
                    >
                        {[max, middle, min].map((price) => (
                            <line
                                key={price}
                                className="chart-grid-line"
                                x1={padding}
                                x2={width - padding}
                                y1={priceToY(price)}
                                y2={priceToY(price)}
                            />
                        ))}

                        <polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />

                        <circle
                            className="current-price-dot"
                            cx={lastX}
                            cy={lastY}
                            r="5" />

                        {hoverState && (
                            <>
                                <line
                                    className="chart-crosshair"
                                    x1={indexToX(history.indexOf(hoverState.point))}
                                    x2={indexToX(history.indexOf(hoverState.point))}
                                    y1={padding}
                                    y2={height - padding}
                                />
                                <circle
                                    className="hover-price-dot"
                                    cx={indexToX(history.indexOf(hoverState.point))}
                                    cy={priceToY(hoverState.point.price)}
                                    r="4"
                                />
                            </>
                        )}
                    </svg>

                    {hoverState && (
                        <div
                            className="chart-tooltip"
                            style={{
                                left: hoverState.x + 12,
                                top: hoverState.y - 12,
                            }}
                        >
                            <div>{formatChartTime(hoverState.point.timestamp)}</div>
                            <div>{`$${hoverState.point.price.toFixed(2)}`}</div>
                        </div>
                    )}

                <div className="chart-time-axis">
                    <span>{formatChartTime(firstPoint.timestamp)}</span>
                    <span>{formatChartTime(middlePoint.timestamp)}</span>
                    <span>{formatChartTime(lastPoint.timestamp)}</span>
                </div>
            </div>

            <div className="chart-price-axis">
                <span>{`$${max.toFixed(2)}`}</span>
                <span>{`$${((max + min) / 2).toFixed(2)}`}</span>
                <span>{`$${min.toFixed(2)}`}</span>
            </div>
        </div>

        </section >
    );
}