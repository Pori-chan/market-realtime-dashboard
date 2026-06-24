import type{MarketData} from "../types/market";

export function MarketTable({ data }: { data: MarketData[] }) {
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
                    <tr key={item.symbol}>
                        <td>{item.symbol}</td>
                        <td>{item.price}</td>
                        <td>{item.changePercent}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}