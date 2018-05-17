import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import allReducers from "./reducers/index.js";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
const middleware = [thunk];

import { BrowserRouter, Route } from "react-router-dom";

import App from "./App.jsx";

// import './index.css';

const persistConfig = {
  key: "root",
  storage
};

const initialState = {};

const persistedReducer = persistReducer(persistConfig, allReducers);
let store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(...middleware)
);
let persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("app")
);
