import type { Trade } from "../types/trade"

type TradeStreamProps = {
    trades: Trade[];
    title: string;
};

export function TradeStream({ trades,title }: TradeStreamProps) {
    return (
        <section className="panel">
            <h2>{title}</h2>

            <div className="trade-list">
                {trades.map((trade)=>(
                    <div className="trade-row" key={trade.id}>
                        <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                        <strong>{trade.symbol}</strong>
                        <span>{`$${trade.price.toFixed(2)}`}</span>
                        <span>{trade.volume}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
