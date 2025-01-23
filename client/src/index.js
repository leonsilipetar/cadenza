import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Wrap the app rendering in a try-catch
try {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
} catch (error) {
  console.error('Application failed to start:', error);
  // Show a user-friendly error message
  document.getElementById('root').innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h1>Something went wrong</h1>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
    </div>
  `;
}

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






