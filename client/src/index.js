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






