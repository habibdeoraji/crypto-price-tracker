import { useMemo, useState } from 'react';
import { SYMBOLS, ALL_SYMBOLS } from '../constants/symbols';
import { useTicker } from '../hooks/useTicker';
import { SearchBar } from './SearchBar';
import { MarketRow } from './MarketRow';

interface Props {
  favorites: Set<string>;
  onToggleFavorite: (symbol: string) => void;
  onSelectSymbol: (symbol: string) => void;
}

type Tab = 'all' | 'favorites';

export function MarketTable({ favorites, onToggleFavorite, onSelectSymbol }: Props) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const tickers = useTicker(ALL_SYMBOLS);

  // Stable per-symbol callbacks so MarketRow memo isn't broken on every render.
  // onToggleFavorite and onSelectSymbol are both stable references (useCallback/useState setter).
  const toggleHandlers = useMemo(
    () => Object.fromEntries(SYMBOLS.map(sym => [sym.symbol, () => onToggleFavorite(sym.symbol)])),
    [onToggleFavorite]
  );
  const selectHandlers = useMemo(
    () => Object.fromEntries(SYMBOLS.map(sym => [sym.symbol, () => onSelectSymbol(sym.symbol)])),
    [onSelectSymbol]
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = SYMBOLS.filter(sym => {
    if (tab === 'favorites' && !favorites.has(sym.symbol)) return false;
    if (normalizedQuery) return sym.symbol.toLowerCase().includes(normalizedQuery) || sym.name.toLowerCase().includes(normalizedQuery);
    return true;
  });

  return (
    <div className="market-table-wrap">
      <div className="market-tabs">
        <button
          className={`tab-btn${tab === 'all' ? ' tab-active' : ''}`}
          onClick={() => setTab('all')}
        >
          All
        </button>
        <button
          className={`tab-btn${tab === 'favorites' ? ' tab-active' : ''}`}
          onClick={() => setTab('favorites')}
        >
          ★ Favorites
        </button>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      {tickers.size === 0 ? (
        <div className="market-loader">
          <div className="market-spinner" />
          <span className="market-loader-text">Connecting to market data…</span>
        </div>
      ) : (
        <>
          <table className="market-table">
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th className="num-cell">LAST PRICE</th>
                <th className="num-cell">24H CHANGE</th>
                <th className="num-cell">VOLUME</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sym => (
                <MarketRow
                  key={sym.symbol}
                  symbol={sym.symbol}
                  name={sym.name}
                  ticker={tickers.get(sym.symbol)}
                  isFavorite={favorites.has(sym.symbol)}
                  onToggleFavorite={toggleHandlers[sym.symbol]}
                  onSelect={selectHandlers[sym.symbol]}
                />
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="no-results">
              {tab === 'favorites' && !normalizedQuery
                ? 'No favorites yet — click a ★ to add one.'
                : `No markets match "${query}"`}
            </p>
          )}
        </>
      )}
      <p className="table-footer">Data from mock server · ws://localhost:8080</p>
    </div>
  );
}
