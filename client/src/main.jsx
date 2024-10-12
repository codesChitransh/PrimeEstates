import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';  // Corrected from persiststor to persistor
import './index.css';
import App from './App.jsx';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your app in Provider */}
      <PersistGate loading={null} persistor={persistor}>  {/* Corrected prop name */}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
