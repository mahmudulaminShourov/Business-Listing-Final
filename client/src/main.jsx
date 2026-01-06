import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import './styles/index.css';

console.log("MAIN.JSX EXECUTING");
const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

