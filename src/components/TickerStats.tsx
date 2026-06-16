import { memo } from 'react';
import type { TickerMessage } from '../types/ws';
import { formatPrice, formatVolume } from '../utils/format';

interface Props {
  ticker: TickerMessage | null;
  symbol: string;
}

function computeChange(ticker: TickerMessage): number {
  if (ticker.open === 0) return 0;
  return ((ticker.close - ticker.open) / ticker.open) * 100;
}

export const TickerStats = memo(function TickerStats({ ticker, symbol }: Props) {
  const change = ticker ? computeChange(ticker) : null;
  const isPositive = change !== null && change >= 0;
  let changeClass = '';
  let changeText = '—';
  if (change !== null) {
    changeClass = isPositive ? 'positive' : 'negative';
    const sign = isPositive ? '+' : '';
    changeText = `${sign}${change.toFixed(2)}%`;
  }

  const priceText = ticker ? `$${formatPrice(ticker.close, symbol)}` : '—';

  const stats = [
    { label: 'MARK PRICE',   value: ticker ? `$${formatPrice(ticker.mark_price, symbol)}` : '—' },
    { label: '24H HIGH',     value: ticker ? `$${formatPrice(ticker.high, symbol)}`        : '—' },
    { label: '24H LOW',      value: ticker ? `$${formatPrice(ticker.low, symbol)}`         : '—' },
    { label: '24H VOLUME',   value: ticker ? formatVolume(ticker.turnover_usd)             : '—' },
    { label: 'FUNDING RATE', value: ticker ? `${(Number.parseFloat(ticker.funding_rate) * 100).toFixed(4)}%` : '—' },
  ];

  const heroClass = ticker ? 'ticker-hero' : 'ticker-hero ticker-loading';

  return (
    <div className={heroClass}>
      <div className="ticker-price-row">
        <span className="ticker-price">{priceText}</span>
        <span className={`ticker-change ${changeClass}`}>{changeText}</span>
      </div>
      <div className="ticker-stats">
        {stats.map(stat => (
          <div key={stat.label} className="stat">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
