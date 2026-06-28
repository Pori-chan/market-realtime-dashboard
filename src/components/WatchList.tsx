import type { Market } from "../types/markets";

type WatchListProps = {
  title: string;
  markets: Market[];
};

export function WatchList({ title, markets }: WatchListProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>

      {markets.map((stock) => (
        <div className="watch-item" key={stock.symbol}>
          <div>{stock.symbol}</div>

          <div className="watch-item-value">
            <div className={`watch-price ${stock.flash === "up" ? "flash-up" : ""} ${stock.flash === "down" ? "flash-down" : ""}`}>
              {`${stock.price.toFixed(2)}`}
            </div>

            <div className={stock.changePercent >= 0 ? "positive" : "negative"}>
              {stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}