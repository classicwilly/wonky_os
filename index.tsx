
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Reverted import of App to use .tsx extension, which is the correct file extension for the component.
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount React application to.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);