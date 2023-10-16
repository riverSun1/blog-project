import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // react앱 전체에서 사용.
import App from './App';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);