import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import { AudioProvider } from './components/AudioProvider.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AudioProvider>
        <App />
      </AudioProvider>
    </Router>
  </React.StrictMode>,
);
