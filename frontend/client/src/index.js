import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App.jsx';

// import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,document.getElementById('app'),
);