import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { SessionProvider } from './context/SessionContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SessionProvider>
    <NotificationProvider>
      <App />
      <div id="modal-root"></div>
    </NotificationProvider>
  </SessionProvider>
);