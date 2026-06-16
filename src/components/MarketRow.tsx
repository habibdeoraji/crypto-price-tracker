import { memo } from 'react';
import type { TickerMessage } from '../types/ws';
import { FavoriteButton } from './FavoriteButton';
import { formatPrice, formatVolume } from '../utils/format';

interface Props {
  symbol: string;
  name: string;
  ticker: TickerMessage | undefined;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
}

function changeModifier(isPositive: boolean): string {
  return isPositive ? ' positive' : ' negative';
}

export const MarketRow = memo(function MarketRow({
  symbol,
  name,
  ticker,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: Props) {
  const change =
    ticker && ticker.open !== 0
      ? ((ticker.close - ticker.open) / ticker.open) * 100
      : null;
  const hasChange = change !== null;
  const isPositive = hasChange && change >= 0;
  const changeClass = `num-cell change-cell${hasChange ? changeModifier(isPositive) : ''}`;

  return (
    <tr
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <td>
        <div className="row-symbol-cell">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          />
          <div className="symbol-cell">
            <span className="symbol-label">{symbol}</span>
            <span className="symbol-name">{name}</span>
          </div>
        </div>
      </td>
      <td className="num-cell price-cell">
        {ticker
          ? `$${formatPrice(ticker.close, symbol)}`
          : <span className="skeleton">——————</span>}
      </td>
      <td className={changeClass}>
        {hasChange
          ? `${isPositive ? '+' : ''}${change.toFixed(2)}%`
          : <span className="skeleton">——</span>}
      </td>
      <td className="num-cell volume-cell">
        {ticker
          ? formatVolume(ticker.turnover_usd)
          : <span className="skeleton">——</span>}
      </td>
    </tr>
  );
});
