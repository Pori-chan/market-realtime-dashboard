import { watchList } from "../data/watchList";

type WatchListProps = {
  title: string;
};

export function WatchList({ title }: WatchListProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>

      {watchList.map((stock) => (
        <div className="watch-item" key={stock.symbol}>
          <div>{stock.symbol}</div>

          <div>
            <div>${stock.price.toFixed(2)}</div>

            <div className={stock.changePercent >= 0 ? "positive" : "negative"}>
              {stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}