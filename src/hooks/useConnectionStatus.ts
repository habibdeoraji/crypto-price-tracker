import { useEffect, useState } from 'react';
import type { ConnectionStatus } from '../types/ws';
import { wsClient } from '../lib/wsClient';

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>(wsClient.status);

  useEffect(() => {
    const removeHandler = wsClient.onStatusChange(setStatus);
    return () => { removeHandler(); };
  }, []);

  return status;
}
