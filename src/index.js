import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // react앱 전체에서 사용.
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);