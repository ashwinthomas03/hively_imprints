import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import additional fonts if needed for the splash screen
import './fonts.css'; // Create this file to import fonts like Playfair Display

// Preload the logo image to ensure it's ready for the splash screen
const preloadLogo = () => {
  const img = new Image();
  img.src = `${process.env.PUBLIC_URL}/logo192.png`;
};

// Preload any other assets needed for splash screen
const preloadAssets = () => {
  preloadLogo();
  // Add other assets to preload here if needed
};

// Preload assets before rendering
preloadAssets();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();