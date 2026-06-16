import { useEffect, useRef, useState } from 'react';
import type { TickerMessage } from '../types/ws';
import { wsClient } from '../lib/wsClient';

export type TickerMap = Map<string, TickerMessage>;

// Flush at 1500ms — matches real exchange list view cadence, comfortable to read
const FLUSH_MS = 1500;

export function useTicker(symbols: string[]): TickerMap {
  const [tickers, setTickers] = useState<TickerMap>(new Map());
  const pendingRef = useRef<Map<string, TickerMessage>>(new Map());
  const symbolsRef = useRef(symbols);

  useEffect(() => {
    const channel = 'v2/ticker';
    wsClient.subscribe(channel, symbolsRef.current);

    const removeListener = wsClient.addChannelHandler(channel, (msg) => {
      // Just buffer; the interval decides when to surface it to React
      const ticker = msg as TickerMessage;
      pendingRef.current.set(ticker.symbol, ticker);
    });

    const intervalId = setInterval(() => {
      if (pendingRef.current.size === 0) return;
      // Drain BEFORE the updater — setState updaters run twice in StrictMode,
      // so any ref mutation inside them would wipe pending data on the second call.
      const batch = new Map(pendingRef.current);
      pendingRef.current.clear();
      setTickers(prev => {
        const next = new Map(prev);
        for (const [sym, t] of batch) next.set(sym, t);
        return next;
      });
    }, FLUSH_MS);

    return () => {
      clearInterval(intervalId);
      removeListener();
      wsClient.unsubscribe(channel, symbolsRef.current);
    };
  }, []);

  return tickers;
}
