import { SYMBOL_PRECISION } from '../constants/symbols';

/**
 * Formats a price value with symbol-specific decimal precision.
 * @param value - Price as a string or number (e.g. 96432.5)
 * @param symbol - Trading symbol used to look up precision (e.g. "BTCUSD")
 * @returns Locale-formatted price string (e.g. "96,432.50")
 */
export function formatPrice(value: string | number, symbol: string): string {
  const precision = SYMBOL_PRECISION[symbol] ?? 2;
  return Number.parseFloat(String(value)).toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/**
 * Abbreviates a large volume number with a K / M / B suffix.
 * @param value - Raw volume number (e.g. 1200000)
 * @returns Abbreviated string (e.g. "1M")
 */
export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toFixed(0);
}

/**
 * Formats an orderbook quantity to 3 decimal places.
 * @param qty - Raw quantity number (e.g. 2.1)
 * @returns Fixed-decimal string (e.g. "2.100")
 */
export function formatQty(qty: number): string {
  return qty.toFixed(3);
}

/**
 * Converts a microsecond Unix timestamp to a 24-hour time string.
 * @param timestampUs - Timestamp in microseconds (e.g. 1718345661000000)
 * @returns Time string in HH:MM:SS format (e.g. "14:27:41")
 */
export function formatTime(timestampUs: number): string {
  return new Date(timestampUs / 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
