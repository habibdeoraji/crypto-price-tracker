import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wsClient } from './lib/wsClient';
import { MarketTable } from './components/MarketTable';
import { ConnectionBadge } from './components/ConnectionBadge';
import { useFavorites } from './hooks/useFavorites';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    wsClient.connect();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Crypto Price Tracker</h1>
        <ConnectionBadge />
      </header>
      <main>
        <section className="markets-card">
          <div className="markets-card-header">
            <h2>Markets</h2>
          </div>
          <MarketTable
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectSymbol={(symbol) => navigate(`/${symbol}`)}
          />
        </section>
      </main>
    </div>
  );
}
