import { memo } from "react";
import { type Translation } from "../i18n/types";
import type { Market } from "../types/markets";
import type { Trade } from "../types/trade";

type StatsPanelProps = {
    t: Translation;
    tradesPerMinute: number;
    mostActiveSymbol: string;
    topGainer: Market | null;
    topLoser: Market | null;
    avgTradeSize: number;
    lastTrade: Trade | null;
    watchListCount: number;
};

export const StatsPanel = memo(function StatsPanel(props: StatsPanelProps) {
    return (
        <section className="panel">
            <h2>{props.t.statistics}</h2>

            <div className="stats-grid">
                <span>{props.t.tradesPerMinute}</span>
                <strong>{props.tradesPerMinute}</strong>

                <span>{props.t.mostActive}</span>
                <strong>{props.mostActiveSymbol}</strong>

                <span>{props.t.topGainer}</span>
                <strong className="positive">{props.topGainer
                    ? `${props.topGainer?.symbol} +${props.topGainer?.changePercent.toFixed(2)}%`
                    : "-"}
                </strong>
                <span>{props.t.topLoser}</span>
                <strong className="negative">{props.topLoser
                    ? `${props.topLoser?.symbol} +${props.topLoser?.changePercent.toFixed(2)}%`
                    : "-"}
                </strong>

                <span>{props.t.avgTradeSize}</span>
                <strong>{props.avgTradeSize}</strong>

                <span>{props.t.lastTrade}</span>
                <strong>{props.lastTrade
                    ? `${props.lastTrade.symbol} $${props.lastTrade.price.toFixed(2)}`
                    : "-"}
                </strong>

                <span>{props.t.watchListCount}</span>
                <strong>{props.watchListCount}</strong>
            </div>
        </section>
    );
});
