export interface SymbolInfo {
  symbol: string;
  name: string;
}

export const SYMBOLS: SymbolInfo[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin' },
  { symbol: 'ETHUSD', name: 'Ethereum' },
  { symbol: 'XRPUSD', name: 'XRP' },
  { symbol: 'SOLUSD', name: 'Solana' },
  { symbol: 'PAXGUSD', name: 'PAX Gold' },
  { symbol: 'DOGEUSD', name: 'Dogecoin' },
];

export const SYMBOL_NAMES: Record<string, string> = Object.fromEntries(
  SYMBOLS.map(sym => [sym.symbol, sym.name])
);

export const ALL_SYMBOLS = SYMBOLS.map(sym => sym.symbol);

// Decimal precision per symbol (matches mock server config)
export const SYMBOL_PRECISION: Record<string, number> = {
  BTCUSD: 1,
  ETHUSD: 2,
  XRPUSD: 4,
  SOLUSD: 4,
  PAXGUSD: 2,
  DOGEUSD: 6,
};
