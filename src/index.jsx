import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoot from './App';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
}

const root = createRoot(document.getElementById('root'));
root.render(<AppRoot />);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[App] Service Worker registered successfully:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
        // Listen for new service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[App] New service worker available');
              // Optionally notify user about update
            }
          });
        });
      })
      .catch((error) => {
        console.error('[App] Service Worker registration failed:', error);
      });
  });
}
