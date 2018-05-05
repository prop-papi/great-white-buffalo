import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CreateBet from './components/CreateBet/index.jsx';
import SearchBets from './components/SearchBets/index.jsx';

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div>
        hi from react
        <Switch>
          <Route path='/createbet' component={CreateBet} />
          <Route path='/searchbets' component={SearchBets} />
        </Switch>
      </div>
    )
  }
};