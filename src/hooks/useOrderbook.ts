import { useEffect, useRef, useState } from 'react';
import type { OrderbookMessage } from '../types/ws';
import { wsClient } from '../lib/wsClient';

const FLUSH_MS = 1000;

interface Snapshot {
  sym: string;
  data: OrderbookMessage;
}

export function useOrderbook(symbol: string): OrderbookMessage | null {
  // Tag each snapshot with its symbol so stale data is filtered without
  // needing a setState(null) call inside the effect body.
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const latestRef = useRef<OrderbookMessage | null>(null);

  useEffect(() => {
    latestRef.current = null;

    const channel = 'l2_orderbook';
    wsClient.subscribe(channel, [symbol]);

    const removeListener = wsClient.addChannelHandler(channel, (msg) => {
      const ob = msg as OrderbookMessage;
      if (ob.symbol !== symbol) return;
      latestRef.current = ob;
    });

    const intervalId = setInterval(() => {
      if (latestRef.current === null) return;
      setSnapshot({ sym: symbol, data: latestRef.current });
      latestRef.current = null;
    }, FLUSH_MS);

    return () => {
      clearInterval(intervalId);
      removeListener();
      wsClient.unsubscribe(channel, [symbol]);
    };
  }, [symbol]);

  // Stale snapshot (symbol just changed) renders as null until first new flush
  return snapshot?.sym === symbol ? snapshot.data : null;
}
