import type { MarketData } from "../types/market";
import { MarketRow } from "./MarketRow";

type MarketTableProps = {
    data: MarketData[];
};

export function MarketTable({ data }: MarketTableProps) {
    // console.log("MarketTable rendered");

    return (
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                </tr>
            </thead>

            <tbody>
                {data.map((item) => (
                    <MarketRow key={item.symbol} item={item} />
                ))}
            </tbody>
        </table>
    );
}