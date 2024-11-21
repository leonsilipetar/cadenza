import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

const root = document.getElementById('root');

// Replace ReactDOM.render with createRoot().render
const rootElement = ReactDOM.createRoot(root);
rootElement.render(
  <BrowserRouter basename="/">
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);
