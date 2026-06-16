import type { ConnectionStatus, WsIncomingMessage } from '../types/ws';

const SERVER_URL = 'ws://localhost:8080';
const MAX_RETRY_DELAY_MS = 30_000;
const INITIAL_RETRY_DELAY_MS = 1_000;

type MessageHandler = (msg: WsIncomingMessage) => void;
type StatusHandler = (status: ConnectionStatus) => void;

// The active WebSocket connection (null when not yet connected)
let socket: WebSocket | null = null;
let connectionStatus: ConnectionStatus = 'disconnected';
let retryDelay = INITIAL_RETRY_DELAY_MS;
let retryTimer: ReturnType<typeof setTimeout> | undefined;

// Which symbols are active per channel, e.g. { 'v2/ticker': Set(['BTCUSD', 'ETHUSD']) }
const activeSubscriptions = new Map<string, Set<string>>();

// Callbacks to call when a message arrives on a given channel
const channelHandlers = new Map<string, Set<MessageHandler>>();

// Callbacks to call whenever the connection status changes
const statusHandlers = new Set<StatusHandler>();

// ─── Internal helpers ──────────────────────────────────────────────────────

function notifyStatusChange(newStatus: ConnectionStatus) {
  connectionStatus = newStatus;
  for (const handler of statusHandlers) {
    handler(newStatus);
  }
}

// After a reconnect, re-subscribe to everything the app was watching
function resubscribeAll() {
  if (socket?.readyState !== WebSocket.OPEN) return;
  if (activeSubscriptions.size === 0) return;

  const channels = Array.from(activeSubscriptions.entries()).map(([name, symbols]) => ({
    name,
    symbols: Array.from(symbols),
  }));

  socket.send(JSON.stringify({ type: 'subscribe', payload: { channels } }));
}

function onSocketOpen() {
  retryDelay = INITIAL_RETRY_DELAY_MS;
  notifyStatusChange('connected');
  resubscribeAll();
}

function onSocketMessage(event: MessageEvent) {
  let message: WsIncomingMessage;
  try {
    message = JSON.parse(event.data as string) as WsIncomingMessage;
  } catch {
    return;
  }

  // The server sends a 'subscriptions' ack after every subscribe/unsubscribe — ignore it
  if (message.type === 'subscriptions') return;

  const handlers = channelHandlers.get(message.type);
  if (!handlers) return;

  for (const handler of handlers) {
    handler(message);
  }
}

function onSocketClose() {
  notifyStatusChange('reconnecting');
  retryTimer = setTimeout(connect, retryDelay);
  retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY_MS);
}

// ─── Public API ────────────────────────────────────────────────────────────

function connect() {
  const alreadyActive =
    socket?.readyState === WebSocket.CONNECTING ||
    socket?.readyState === WebSocket.OPEN;

  if (alreadyActive) return;

  clearTimeout(retryTimer);
  notifyStatusChange('connecting');

  socket = new WebSocket(SERVER_URL);
  socket.onopen = onSocketOpen;
  socket.onmessage = onSocketMessage;
  socket.onclose = onSocketClose;
  // onerror always triggers onclose right after, so we let onclose handle the retry
  socket.onerror = () => {};
}

function subscribe(channel: string, symbols: string[]) {
  let symbolSet = activeSubscriptions.get(channel);
  if (!symbolSet) {
    symbolSet = new Set();
    activeSubscriptions.set(channel, symbolSet);
  }
  for (const symbol of symbols) symbolSet.add(symbol);

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'subscribe',
      payload: { channels: [{ name: channel, symbols }] },
    }));
  }
}

function unsubscribe(channel: string, symbols: string[]) {
  const symbolSet = activeSubscriptions.get(channel);
  if (symbolSet) {
    for (const symbol of symbols) symbolSet.delete(symbol);
    if (symbolSet.size === 0) activeSubscriptions.delete(channel);
  }

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'unsubscribe',
      payload: { channels: [{ name: channel, symbols }] },
    }));
  }
}

// Register a handler for messages on a channel. Returns a cleanup function.
function addChannelHandler(channel: string, handler: MessageHandler) {
  let handlers = channelHandlers.get(channel);
  if (!handlers) {
    handlers = new Set();
    channelHandlers.set(channel, handlers);
  }
  handlers.add(handler);
  return () => channelHandlers.get(channel)?.delete(handler);
}

// Register a handler for connection status changes. Returns a cleanup function.
// The handler is called immediately with the current status.
function onStatusChange(handler: StatusHandler) {
  statusHandlers.add(handler);
  handler(connectionStatus);
  return () => statusHandlers.delete(handler);
}

export const wsClient = {
  connect,
  subscribe,
  unsubscribe,
  addChannelHandler,
  onStatusChange,
  get status() { return connectionStatus; },
};
