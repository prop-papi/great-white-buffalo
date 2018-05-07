import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { FormGroup, FormControl, Input, Button, Form } from 'react-bootstrap';

// use react-boostrap
import './Chat.css';

export default class Chat extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);

    this.state = {
      messageText: ''
    };
  }

  handleChange(e) {
    console.log('message ', this.state.messageText);
    this.setState({ messageText: e.target.value });
  }

  handleEnterKeyPress(e) {
    if (e.key === 'Enter') {
      console.log('message sent: ', this.state.messageText);
      // send the message to db / cache
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div className="chat-main-container">
        <div>test</div>
        <h1>TEST TEST TEST</h1>
        <FormControl
          type="text"
          value={this.state.messageText}
          placeholder="Message to LOUNGE_NAME"
          // could also dynamically render "Lounge" vs a "Direct Message"
          // for example:
          // Message to LOUNGE_NAME
          // Message to @USER (Direct Message)
          onChange={this.handleChange}
          onKeyPress={this.handleEnterKeyPress}
        />
      </div>
    );
  }
}
