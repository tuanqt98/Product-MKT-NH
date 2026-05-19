"use client";

import { useEffect } from 'react';

export default function DevServiceWorkerReset() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!('serviceWorker' in navigator)) return;

    const clearStalePwaState = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      }
    };

    void clearStalePwaState();
  }, []);

  return null;
}
