import { useConnectionStatus } from '../hooks/useConnectionStatus';

const STATUS_LABEL: Record<string, string> = {
  connected: 'Live',
  connecting: 'Connecting',
  reconnecting: 'Reconnecting',
  disconnected: 'Disconnected',
};

export function ConnectionBadge() {
  const status = useConnectionStatus();
  return (
    <div className={`connection-badge status-${status}`}>
      <span className="connection-dot" />
      <span>{STATUS_LABEL[status]}</span>
    </div>
  );
}
