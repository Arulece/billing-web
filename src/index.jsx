import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoot from './App';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
}

const root = createRoot(document.getElementById('root'));
root.render(<AppRoot />);
