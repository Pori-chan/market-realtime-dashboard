import type { Translation } from "../i18n/types";
import type { FinnhubSymbolSearchResult } from "../types/finnhub";
import type { Market } from "../types/markets";
import { Sparkline } from "./Sparkline";
import type { SortKey } from "../types/markets";

type WatchListProps = {
  t: Translation;
  markets: Market[];
  searchQuery: string;
  searchResults: FinnhubSymbolSearchResult[];
  onSearchQueryChange: (query: string) => void;
  onAddSymbol: (symbol: string) => void;
  addSymbolError: string;
  onRemoveSymbol: (symbol: string) => void;
  onResetSymbols: () => void;
  sortKey: string;
  onSortKeyChange: (sortKey: SortKey) => void;
};

export function WatchList(props: WatchListProps) {
  return (
    <section className="panel">
      <h2>{props.t.watchList}</h2>

      <div className="symbol-search">
        <input
          value={props.searchQuery}
          onChange={(event) => props.onSearchQueryChange(event.target.value)}
          placeholder={props.t.searchSymbol}
        />

        {props.searchResults.length > 0 && (

          <div className="search-results">
            {props.addSymbolError && (
              <div className="symbol-search-error">{props.addSymbolError}</div>
            )}
            {props.searchResults.slice(0, 5).map((result) => (
              <button
                key={result.symbol}
                type="button"
                onClick={() => props.onAddSymbol(result.symbol)}
                aria-label={`${props.t.removeSymbol(result.symbol)}`}
              >
                <strong>{result.symbol}</strong>
                <span>{result.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sort-buttons">
        <button
          type="button"
          className={props.sortKey==="symbol"?"active":""}
          onClick={()=>props.onSortKeyChange("symbol")}
          >
            {props.t.symbol}
        </button>
        <button
          type="button"
          className={props.sortKey==="price"?"active":""}
          onClick={()=>props.onSortKeyChange("price")}
          >
            {props.t.price}
        </button>
        <button
          type="button"
          className={props.sortKey==="changePercent"?"active":""}
          onClick={()=>props.onSortKeyChange("changePercent")}
          >
            {props.t.changePercent}
        </button>
      </div>
      <button
        type="button"
        className="reset-watchlist-button"
        onClick={props.onResetSymbols}
      >
        {props.t.resetWatchList}
      </button>


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

          <button
            type="button"
            className="remove-symbol-button"
            onClick={() => props.onRemoveSymbol(stock.symbol)}
          >
            ×
          </button>
        </div>
      ))}
    </section>
  );
}