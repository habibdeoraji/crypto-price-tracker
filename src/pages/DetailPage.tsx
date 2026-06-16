import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { wsClient } from '../lib/wsClient';
import { useFavorites } from '../hooks/useFavorites';
import { DetailView } from '../components/DetailView';
import { ALL_SYMBOLS } from '../constants/symbols';

export function DetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    wsClient.connect();
  }, []);

  if (!symbol || !ALL_SYMBOLS.includes(symbol)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app">
      <DetailView
        symbol={symbol}
        isFavorite={favorites.has(symbol)}
        onToggleFavorite={() => toggleFavorite(symbol)}
        onBack={() => navigate('/')}
      />
    </div>
  );
}
