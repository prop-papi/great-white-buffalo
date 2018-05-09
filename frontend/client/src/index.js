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

const initialState = {
  // set initial state based on the last club a user was in...create a field in the db that stores this
  // if we're just pulling the most recent x messages, what if one room is way more active? another may not have any pulled back
  // data we want.... {
  //  recentMessagesInCurrentClub = [{},{}]
  //  mostRecentClub = 3 // needs to be stored on the user table so that we know what club to put them in and pull data for initially
  //  allBetsInCurrentClub = [{},{}]
  //  allOfMyBets = [{},{}] open or not w/ a boolean denoting?
  //  myClubs = [{},[}]] from usersclub table innerjoined w/ club table
  //  myLounges = [{},[}]] from userslounges table inner joined w/ lounges table? or just pull myLounges from current club?
  //  anything else???
  // }
};

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
