import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ParallaxProvider } from 'react-scroll-parallax'; // <-- Import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ParallaxProvider> {/* <-- Add the wrapper */}
      <App />
    </ParallaxProvider>
  </React.StrictMode>
);