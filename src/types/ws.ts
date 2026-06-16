export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface TickerMessage {
  type: 'v2/ticker';
  symbol: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  turnover_usd: number;
  mark_price: string;
  spot_price: string;
  funding_rate: string;
  timestamp: number;
  ltp_change_24h: string;
  description: string;
  quotes: {
    best_ask: string;
    best_bid: string;
    ask_size: string;
    bid_size: string;
    ask_iv: null;
    bid_iv: null;
    impact_mid_price: null;
    mark_iv: string;
  };
}

// [price, quantity] tuples — 500 levels, index 0 closest to mid
export type OrderbookLevel = [string, string];

export interface OrderbookMessage {
  type: 'l2_orderbook';
  symbol: string;
  bids: OrderbookLevel[]; // sorted descending by price (highest bid first)
  asks: OrderbookLevel[]; // sorted ascending by price (lowest ask first)
  timestamp: number;
}

export interface TradeMessage {
  type: 'all_trades';
  symbol: string;
  price: string;
  size: number;
  buyer_role: 'maker' | 'taker';
  seller_role: 'maker' | 'taker';
  product_id: number;
  timestamp: number;
}

export interface SubscriptionsAck {
  type: 'subscriptions';
  payload: {
    channels: Array<{ name: string; symbols: string[] }>;
  };
}

export type WsIncomingMessage = TickerMessage | OrderbookMessage | TradeMessage | SubscriptionsAck;

