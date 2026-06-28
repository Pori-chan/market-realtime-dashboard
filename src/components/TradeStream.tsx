import type { Trade } from "../types/trade"

type TradeStreamProps = {
    trades: Trade[];
};

export function TradeStream({ trades }: TradeStreamProps) {
    return (
        <section className="panel">
            <h2>Trade Stream</h2>

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
