import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import SearchBets from "./components/SearchBets/index.jsx";
import CreateBet from "./components/CreateBet/index.jsx";
import ClubNav from "./components/ClubNav/index.jsx";
import LoungeList from "./components/LoungeList/index.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import TestInfo from "./components/TestInfo/index.jsx";
import Home from "./components/Home/Home.jsx";
import Chat from "./components/Chat/Chat.jsx";
import Leaderboard from "./components/Leaderboard/Leaderboard.jsx";
import Landing from "./components/Auth/Landing.jsx";

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Landing} />
          <Route path="/home" component={Home} />
        </Switch>
      </div>
    );
  }
}
