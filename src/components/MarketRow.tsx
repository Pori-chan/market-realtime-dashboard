import { memo } from "react";
import type { MarketData } from "../types/market";

type MarketRowProps = {
    item: MarketData;
}

export const MarketRow = memo(function MarketRow({ item }: MarketRowProps) {
    // console.count(`MarketRow:${item.symbol}`);
    return (
        <tr>
            <td>{item.symbol}</td>
            <td>{item.price}</td>
            <td className={item.changePercent >= 0 ? "positive" : "negative"}>
                {item.changePercent > 0 ? "+" : ""}
                {item.changePercent}%
            </td>
        </tr>
    );
})
