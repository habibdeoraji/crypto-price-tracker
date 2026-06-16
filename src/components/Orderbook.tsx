import { memo, useMemo } from 'react';
import { useOrderbook } from '../hooks/useOrderbook';
import { SYMBOL_PRECISION } from '../constants/symbols';
import { formatPrice, formatQty } from '../utils/format';

interface Props {
  symbol: string;
}

const TOP_N = 10;

function computeLevels(
  rawLevels: [string, string][],
  side: 'ask' | 'bid'
) {
  const top = rawLevels.slice(0, TOP_N);

  let runningTotal = 0;
  const levelsWithCumulative = top.map(([price, qty]) => {
    runningTotal += Number.parseFloat(qty);
    return { price, qty: Number.parseFloat(qty), cumulative: runningTotal };
  });

  const maxCumulative = runningTotal || 1;

  if (side === 'ask') {
    // Asks display: highest price at top → reverse without mutating
    return levelsWithCumulative.toReversed().map(level => ({ ...level, barPercent: (level.cumulative / maxCumulative) * 100 }));
  }
  return levelsWithCumulative.map(level => ({ ...level, barPercent: (level.cumulative / maxCumulative) * 100 }));
}

const AskRows = memo(function AskRows({
  levels,
  symbol,
}: {
  levels: ReturnType<typeof computeLevels>;
  symbol: string;
}) {
  return (
    <>
      {levels.map(level => (
        <tr key={level.price}>
          <td className="ob-price ob-ask">{formatPrice(level.price, symbol)}</td>
          <td className="ob-qty">{formatQty(level.qty)}</td>
          <td
            className="ob-total ob-ask"
            style={{
              background: `linear-gradient(to left, rgba(220,38,38,0.12) ${level.barPercent}%, transparent ${level.barPercent}%)`,
            }}
          >
            {formatQty(level.cumulative)}
          </td>
        </tr>
      ))}
    </>
  );
});

const BidRows = memo(function BidRows({
  levels,
  symbol,
}: {
  levels: ReturnType<typeof computeLevels>;
  symbol: string;
}) {
  return (
    <>
      {levels.map(level => (
        <tr key={level.price}>
          <td className="ob-price ob-bid">{formatPrice(level.price, symbol)}</td>
          <td className="ob-qty">{formatQty(level.qty)}</td>
          <td
            className="ob-total ob-bid"
            style={{
              background: `linear-gradient(to left, rgba(22,163,74,0.12) ${level.barPercent}%, transparent ${level.barPercent}%)`,
            }}
          >
            {formatQty(level.cumulative)}
          </td>
        </tr>
      ))}
    </>
  );
});

// Stable skeleton rows — 3 cells per row matching the real row structure so
// column widths don't shift when live data replaces them (eliminates CLS).
const ASK_SKELETONS = Array.from({ length: TOP_N }, (_, i) => `ask-sk-${i}`);
const BID_SKELETONS = Array.from({ length: TOP_N }, (_, i) => `bid-sk-${i}`);

export function Orderbook({ symbol }: Props) {
  const orderbook = useOrderbook(symbol);

  const { askLevels, bidLevels, spread, spreadPct } = useMemo(() => {
    if (orderbook) {
      const askLevels = computeLevels(orderbook.asks, 'ask');
      const bidLevels = computeLevels(orderbook.bids, 'bid');

      const bestAsk = Number.parseFloat(orderbook.asks[0]?.[0] ?? '0');
      const bestBid = Number.parseFloat(orderbook.bids[0]?.[0] ?? '0');
      const spread = bestAsk - bestBid;
      const spreadPct = bestBid > 0 ? (spread / bestBid) * 100 : 0;

      return { askLevels, bidLevels, spread, spreadPct };
    }
    return { askLevels: [], bidLevels: [], spread: null, spreadPct: null };
  }, [orderbook]);

  const spreadText = spread === null
    ? '—'
    : `Spread: ${spread.toFixed(SYMBOL_PRECISION[symbol] ?? 2)} (${spreadPct.toFixed(3)}%)`;

  return (
    <div className="ob-panel">
      <h3 className="panel-title">Orderbook</h3>
      <table className="ob-table">
        <colgroup>
          <col className="ob-col-price" />
          <col className="ob-col-qty" />
          <col className="ob-col-total" />
        </colgroup>
        <thead>
          <tr>
            <th className="ob-price">PRICE</th>
            <th className="ob-qty">SIZE</th>
            <th className="ob-total">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {orderbook ? (
            <AskRows levels={askLevels} symbol={symbol} />
          ) : (
            ASK_SKELETONS.map(key => (
              <tr key={key}>
                <td className="ob-price ob-skeleton">—</td>
                <td className="ob-qty ob-skeleton">—</td>
                <td className="ob-total ob-skeleton">—</td>
              </tr>
            ))
          )}
          <tr className="ob-spread-row">
            <td colSpan={3}>{spreadText}</td>
          </tr>
          {orderbook ? (
            <BidRows levels={bidLevels} symbol={symbol} />
          ) : (
            BID_SKELETONS.map(key => (
              <tr key={key}>
                <td className="ob-price ob-skeleton">—</td>
                <td className="ob-qty ob-skeleton">—</td>
                <td className="ob-total ob-skeleton">—</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
