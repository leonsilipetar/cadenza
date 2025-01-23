import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create root
const container = document.getElementById('root');
const root = createRoot(container);

// Render app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register service worker
serviceWorkerRegistration.register();

// Modify the service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('Firebase SW registered:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, but don't notify too often
              const lastNotification = localStorage.getItem('lastUpdateNotification');
              const now = Date.now();
              if (!lastNotification || now - parseInt(lastNotification) > 1000 * 60 * 60) {
                // Show notification only once per hour
                localStorage.setItem('lastUpdateNotification', now);
                console.log('New content is available; please refresh.');
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}






