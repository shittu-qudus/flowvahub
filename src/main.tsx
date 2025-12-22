// main.tsx or index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Supabase is automatically initialized when imported in lib/supabase
// No need to call SupabaseService.initialize() manually

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);