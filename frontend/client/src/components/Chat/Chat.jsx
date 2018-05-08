import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormControl, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import moment from 'moment';
// import socket from 'socket.io';
import io from 'socket.io-client';

// custom css
import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);

    this.state = {
      text: '',
      // endpoint: 'localhost:3000'
      test: 'black'
    };
  }

  handleChange(e) {
    console.log('message ', this.state.text);
    this.setState({ text: e.target.value });
  }

  handleEnterKeyPress(e) {
    if (e.key === 'Enter') {
      console.log('message sent: ', this.state.text);
      console.log('test message data', this.props.data.localData.messages);
      // send the message to db / cache

      const socket = io('https://localhost:3000');
      socket.emit('test', this.state.test);

      // socket emit

      // socket.emit('message.sent', {
      //   message: this.state.text,
      //   user: localStorage.username
      //   // specify lounge as well
      // });
      this.setState({ text: '' });
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <h1 className="main-component-nav">MAIN COMPONENT NAV BAR GOES HERE</h1>
        <br />
        <div className="chat-main-container">
          <Panel>
            <ListGroup>
              {this.props.data.localData.messages.map(message => {
                return (
                  <ListGroupItem key={message._id}>
                    {message.text}
                    <span>{moment(message.createdAt).fromNow()}</span>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Panel>
          <Panel>
            <FormControl
              type="text"
              value={this.state.text}
              placeholder="Chatting in LOUNGE_NAME"
              // could also dynamically render "Lounge" vs a "Direct Message"
              // for example:
              // Message to LOUNGE_NAME
              // Message to @USER (Direct Message)
              onChange={this.handleChange}
              onKeyPress={this.handleEnterKeyPress}
            />
          </Panel>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.message,
    data: state.data
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      // setTestData: setTestData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Chat);
