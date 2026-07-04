import { memo } from "react";
import type { Trade } from "../types/trade"

type TradeStreamProps = {
    trades: Trade[];
    title: string;
};

export const TradeStream = memo(function TradeStream({ trades,title }: TradeStreamProps) {
    return (
        <section className="panel">
            <h2>{title}</h2>

            <div className="trade-list">
                {trades.map((trade)=>(
                    <div className="trade-row" key={trade.id}>
                        <span className="trade-time">
                            {new Date(trade.timestamp).toLocaleTimeString("ja-JP",{
                                hour12:false,
                                hour:"2-digit",
                                minute:"2-digit",
                                second:"2-digit",
                                fractionalSecondDigits:3,
                            })}
                        </span>
                        <strong className="trade-symbol">{trade.symbol}</strong>
                        <span className="trade-price">{`$${trade.price.toFixed(2)}`}</span>
                        <span className="trade-volume">{trade.volume}</span>
                    </div>
                ))}
            </div>
        </section>
    );
});
