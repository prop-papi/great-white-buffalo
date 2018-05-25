import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
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
