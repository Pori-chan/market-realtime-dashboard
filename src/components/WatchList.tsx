import type { FinnhubSymbolSearchResult } from "../types/finnhub";
import type { Market } from "../types/markets";
import { Sparkline } from "./Sparkline";

type WatchListProps = {
  title: string;
  markets: Market[];
  searchQuery: string;
  searchResults: FinnhubSymbolSearchResult[];
  onSearchQueryChange: (query: string) => void;
  onAddSymbol: (symbol: string) => void;
};

export function WatchList(props: WatchListProps) {
  return (
    <section className="panel">
      <h2>{props.title}</h2>

      <div className="symbol-search">
        <input
          value={props.searchQuery}
          onChange={(event) => props.onSearchQueryChange(event.target.value)}
          placeholder="Search symbol..."
        />

        {props.searchResults.length > 0 && (
          <div className="search-results">
            {props.searchResults.slice(0, 5).map((result) => (
              <button
                key={result.symbol}
                type="button"
                onClick={() => props.onAddSymbol(result.symbol)}
              >
                <strong>{result.symbol}</strong>
                <span>{result.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {props.markets.map((stock) => (
        <div className="watch-item" key={stock.symbol}>
          <div className="watch-symbol">{stock.symbol}</div>

          <Sparkline
            values={stock.history}
            trend={stock.trend}
          />

          <div className="watch-item-value">
            <div key={stock.flashKey}
              className={`watch-price ${stock.flash === "up" ? "flash-up" : ""
                } ${stock.flash === "down" ? "flash-down" : ""}`}
            >
              {`$${stock.price.toFixed(2)}`}
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