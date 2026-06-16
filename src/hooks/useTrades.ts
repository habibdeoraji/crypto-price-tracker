import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { TradeMessage } from '../types/ws';
import { wsClient } from '../lib/wsClient';

export interface EnrichedTrade extends TradeMessage {
  _id: string;
  _isNew: boolean;
  side: 'buy' | 'sell';
}

const MAX_TRADES = 20;
const FLUSH_MS = 1500;
const MAX_PER_FLUSH = 2;

interface TradesSnapshot {
  sym: string;
  trades: EnrichedTrade[];
}

type SetSnapshot = Dispatch<SetStateAction<TradesSnapshot>>;

function scheduleFlashClear(ids: string[], setSnapshot: SetSnapshot): void {
  const idSet = new Set(ids);
  setTimeout(() => {
    setSnapshot(prev => ({
      ...prev,
      trades: prev.trades.map(trade => (idSet.has(trade._id) ? { ...trade, _isNew: false } : trade)),
    }));
  }, 400);
}

export function useTrades(symbol: string): EnrichedTrade[] {
  // Tag state with the current symbol so switching symbols returns empty
  // immediately without needing a synchronous setTrades([]) inside the effect.
  const [snapshot, setSnapshot] = useState<TradesSnapshot>({ sym: symbol, trades: [] });
  const counterRef = useRef(0);
  const pendingRef = useRef<TradeMessage[]>([]);

  useEffect(() => {
    pendingRef.current = [];

    const channel = 'all_trades';
    wsClient.subscribe(channel, [symbol]);

    const removeListener = wsClient.addChannelHandler(channel, (msg) => {
      const trade = msg as TradeMessage;
      if (trade.symbol !== symbol) return;
      pendingRef.current.push(trade);
    });

    const intervalId = setInterval(() => {
      if (pendingRef.current.length === 0) return;

      const batch = pendingRef.current.splice(0).slice(-MAX_PER_FLUSH).reverse();

      const ids: string[] = [];
      const enriched: EnrichedTrade[] = batch.map(rawTrade => {
        const id = String(++counterRef.current);
        ids.push(id);
        return {
          ...rawTrade,
          _id: id,
          _isNew: true,
          side: rawTrade.buyer_role === 'taker' ? 'buy' : 'sell',
        };
      });

      setSnapshot(prev => {
        // Discard trades from a previous symbol on the first flush after switching
        const base = prev.sym === symbol ? prev.trades : [];
        return { sym: symbol, trades: [...enriched, ...base].slice(0, MAX_TRADES) };
      });
      scheduleFlashClear(ids, setSnapshot);
    }, FLUSH_MS);

    return () => {
      clearInterval(intervalId);
      removeListener();
      wsClient.unsubscribe(channel, [symbol]);
    };
  }, [symbol]);

  // Stale snapshot (symbol just changed) returns empty until first flush arrives
  return snapshot.sym === symbol ? snapshot.trades : [];
}
