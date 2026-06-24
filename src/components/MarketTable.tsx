import {mockMarketData} from "../data/mockMarketData";

export function MarketTable(){
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
                {mockMarketData.map((item)=>(
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