import { Star } from 'lucide-react';

interface Props {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: number;
}

export function FavoriteButton({ isFavorite, onToggle, size = 18 }: Props) {
  return (
    <button
      className={`fav-btn ${isFavorite ? 'fav-active' : ''}`}
      onClick={onToggle}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        size={size}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      />
    </button>
  );
}
