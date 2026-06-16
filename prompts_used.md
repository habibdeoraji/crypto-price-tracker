# Prompts Used to Build This Project

A log of the AI-assisted prompts used during development, in roughly chronological order.

---

## Project Setup

- "Set up a new React + TypeScript + Vite project for a crypto price tracker"
- "What folder structure should I use for a WebSocket-driven React app?"
- "Add ESLint with typescript-eslint to the project"

---

## WebSocket Client

- "How do I create a singleton WebSocket client in TypeScript that isn't tied to React?"
- "Write a wsClient module that manages a single WebSocket connection and supports multiple channel subscriptions"
- "Add exponential backoff reconnection logic to my wsClient"
- "How do I track active subscriptions so I can replay them after a reconnect?"
- "The onerror and onclose both fire on disconnect — how do I avoid handling the retry twice?"
- "Add a status change observer pattern to wsClient so components can subscribe to connection state"

---

## TypeScript Types

- "Write TypeScript interfaces for the WebSocket message types: ticker, orderbook, trades, and subscriptions ack"
- "The orderbook levels are `[string, string]` tuples — what's the best way to type that?"

---

## Custom Hooks

### useTicker
- "Write a useTicker hook that subscribes to the v2/ticker channel and returns a Map of symbol to ticker data"
- "The ticker updates too fast and makes the UI flicker — how do I batch updates?"
- "How do I drain a ref inside setState safely in React StrictMode to avoid double mutation?"

### useOrderbook
- "Write a useOrderbook hook that subscribes to l2_orderbook and returns the latest snapshot"
- "I only want to re-render at most once per second regardless of how fast the server sends — how do I throttle that?"
- "When I switch symbols the old orderbook data flashes before the new one arrives — how do I fix that without calling setState inside the effect body?"

### useTrades
- "Write a useTrades hook that buffers incoming trades and flushes them in batches"
- "How do I add a unique ID to each trade for use as a React key?"
- "I want to flash new trades green/red for 400ms then clear the highlight — how do I schedule that cleanup?"
- "Switching symbols briefly shows old trades — fix this without a synchronous setState in the effect"
- "What is the symbol-tagged snapshot pattern in React?"

### useConnectionStatus
- "Write a useConnectionStatus hook that returns the current WebSocket connection state"
- "The TypeScript strict mode is complaining that my effect cleanup returns a boolean — how do I fix that?"

### useFavorites
- "Write a useFavorites hook that persists to localStorage and exposes a toggleFavorite function"

---

## Components

### Market List
- "Build a MarketTable component that shows a list of symbols with their live ticker data"
- "Add a search bar that filters by symbol name or ticker in real time"
- "Add an All / Favorites tab switcher above the table"
- "The table flickers when ticker data updates — how do I memoize MarketRow properly?"
- "Why do my memoized rows still re-render? The callbacks are new on every parent render"
- "How do I create stable per-symbol callback maps with useMemo so React.memo actually works?"
- "Show a full spinner instead of skeleton rows while waiting for the first ticker data"

### Detail View
- "Build a detail view that shows ticker stats, orderbook, and recent trades side by side"
- "Add a back button and a favourite toggle to the detail header"

### Orderbook
- "Render the top 10 ask and bid levels in a table with price, size, and cumulative total"
- "Add a visual depth bar to each row showing cumulative size relative to the max"
- "The column widths jump when real data replaces the loading dashes — how do I prevent that?"
- "Add a spread row between asks and bids showing absolute spread and percentage"
- "Asks should display with the highest price at the top — how do I reverse without mutating the array?"
- "Memoize AskRows and BidRows separately so only the changed side re-renders"

### Recent Trades
- "Build a RecentTrades component that shows the last 20 trades with price, size, side, and time"
- "Colour buy trades green and sell trades red"
- "Add a flash animation when new trades appear at the top"
- "The trade rows shift width when real data loads — add colgroup to fix it"
- "Format the timestamp from microseconds to HH:MM:SS"

### TickerStats
- "Build a ticker hero section showing mark price, 24h high/low, volume, and funding rate"
- "The layout shifts when ticker data arrives — always render the full layout with dash placeholders"
- "Make the stats config-driven using an array instead of repeated JSX"
- "Wrap TickerStats in React.memo so orderbook updates don't re-render it"
- "Extract computeChange into a separate function to reduce cognitive complexity"

### ConnectionBadge
- "Add a connection status badge to the header that shows live/connecting/reconnecting/disconnected"
- "Animate the dot when reconnecting"

### FavoriteButton
- "Replace my hand-rolled star SVG with the Star icon from lucide-react"

### SearchBar
- "Replace hand-rolled SVGs in the search bar with Search and X from lucide-react"

---

## Routing

- "Should the detail view have its own URL route or be inline state?"
- "Add React Router so each symbol has its own route like /BTCUSD"
- "How do I redirect to home if someone navigates directly to an unknown symbol?"
- "Keep DetailView unaware of routing — use a thin DetailPage wrapper that reads useParams"

---

## Utilities

- "Extract formatPrice, formatVolume, formatQty, formatTime into a shared utils file"
- "formatPrice should use per-symbol decimal precision — where should that config live?"
- "Add JSDoc comments to each function in format.ts"

---

## Performance & Cleanup

- "Is setInterval or requestAnimationFrame better for batching WebSocket updates?"
- "Make sure all variable names are readable — no single-letter abbreviations"
- "The numeric column headers aren't aligning with the cell values"
- "The market table header text-align is overriding num-cell because of CSS specificity"

---

## CSS & Layout

- "There is lots of CLS on the detail page — how do I fix it?"
- "The orderbook and trades update too fast to read — slow them down"
- "Decrease the vertical spacing between trade rows by 1px"
- "The home page table values are not aligned with the header text"

---

## README & Submission

- "Write a detailed README covering setup, architecture, and design decisions"
- "The README needs setup instructions, a brief description of approach, and what I'd improve with more time"
- "Make sure the app meets all the requirements from the brief before submitting"
