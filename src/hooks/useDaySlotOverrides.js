import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dayslot_overrides_v1';

export function useDaySlotOverrides() {
  const [overrides, setOverrides] = useState({});

  // Load on client only — avoids SSR/hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {}
  }, [overrides]);

  return [overrides, setOverrides];
}
