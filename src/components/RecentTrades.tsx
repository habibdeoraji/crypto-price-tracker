import { useTrades } from '../hooks/useTrades';
import { formatPrice, formatTime } from '../utils/format';

interface Props {
  symbol: string;
}

// 20 stable keys — matches roughly the same height as the orderbook's 21 rows
// (10 asks + spread + 10 bids), so neither panel resizes when data arrives.
const SKELETON_KEYS = Array.from({ length: 10 }, (_, i) => `tr-sk-${i}`);

export function RecentTrades({ symbol }: Props) {
  const trades = useTrades(symbol);

  return (
    <div className="trades-panel">
      <h3 className="panel-title">Recent Trades</h3>
      <table className="trades-table">
        <colgroup>
          <col className="tr-col-price" />
          <col className="tr-col-size" />
          <col className="tr-col-side" />
          <col className="tr-col-time" />
        </colgroup>
        <thead>
          <tr>
            <th className="tr-price">PRICE</th>
            <th className="tr-size">SIZE</th>
            <th className="tr-side">SIDE</th>
            <th className="tr-time">TIME</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0
            ? SKELETON_KEYS.map(key => (
              <tr key={key}>
                <td className="tr-price ob-skeleton">—</td>
                <td className="tr-size ob-skeleton">—</td>
                <td className="tr-side ob-skeleton">—</td>
                <td className="tr-time ob-skeleton">—</td>
              </tr>
            ))
            : trades.map(trade => (
              <tr
                key={trade._id}
                className={trade._isNew ? `trade-new trade-new-${trade.side}` : ''}
              >
                <td className={`tr-price ${trade.side === 'buy' ? 'ob-bid' : 'ob-ask'}`}>
                  {formatPrice(trade.price, symbol)}
                </td>
                <td className="tr-size">{trade.size}</td>
                <td className="tr-side">
                  <span className={`side-badge side-${trade.side}`}>
                    {trade.side.toUpperCase()}
                  </span>
                </td>
                <td className="tr-time">{formatTime(trade.timestamp)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
