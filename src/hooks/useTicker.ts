import { useEffect, useReducer } from 'react';

export function useTicker(intervalMs = 30_000): void {
  const [, tick] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
