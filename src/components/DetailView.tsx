import { useTicker } from '../hooks/useTicker';
import { Orderbook } from './Orderbook';
import { RecentTrades } from './RecentTrades';
import { TickerStats } from './TickerStats';
import { FavoriteButton } from './FavoriteButton';
import { SYMBOL_NAMES } from '../constants/symbols';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import type { ConnectionStatus } from '../types/ws';

function statusLabel(status: ConnectionStatus): string {
  if (status === 'connected') return 'WebSocket connected · Live updates active';
  if (status === 'reconnecting') return 'Reconnecting…';
  return 'Disconnected';
}

interface Props {
  symbol: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
}

export function DetailView({ symbol, isFavorite, onToggleFavorite, onBack }: Props) {
  const tickers = useTicker([symbol]);
  const ticker = tickers.get(symbol);
  const status = useConnectionStatus();

  const name = SYMBOL_NAMES[symbol] ?? symbol;

  return (
    <div className="detail-view">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="detail-symbol-info">
          <span className="detail-symbol">{symbol}</span>
          <span className="detail-name">{name} Perpetual</span>
        </div>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          size={22}
        />
      </div>

      {/* Ticker hero — TickerStats handles its own null state to avoid CLS */}
      <TickerStats ticker={ticker ?? null} symbol={symbol} />

      {/* Market panels */}
      <div className="detail-panels">
        <Orderbook symbol={symbol} />
        <RecentTrades symbol={symbol} />
      </div>

      {/* Footer status */}
      <div className="detail-footer">
        <span className={`footer-dot status-${status}`} />
        <span>{statusLabel(status)}</span>
      </div>
    </div>
  );
}
