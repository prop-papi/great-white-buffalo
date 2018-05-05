import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import CreateBet from "./components/CreateBet/index.jsx";
import SearchBets from "./components/SearchBets/index.jsx";
import CreateBet from "./components/CreateBet/index.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div>
        <Switch>
          <Route path="/searchbets" component={SearchBets} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/createbet" component={CreateBet} />
        </Switch>
      </div>
    );
  }
}
