import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store'; 
 import './index.css'
 import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your app in Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
