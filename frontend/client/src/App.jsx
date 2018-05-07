import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import SearchBets from "./components/SearchBets/index.jsx";
import CreateBet from "./components/CreateBet/index.jsx";
import ClubNav from "./components/ClubNav/index.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import TestInfo from "./components/TestInfo/index.jsx";

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/searchbets" component={SearchBets} />
          <Route path="/createbet" component={CreateBet} />
          <Route path="/test" component={TestInfo} />
          <Route path="/clubnav" component={ClubNav} />
        </Switch>
      </div>
    );
  }
}
