import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormControl, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import moment from 'moment';
import io from 'socket.io-client';

// custom css
import './Chat.css';

// connection to socket server
const socket = io('http://localhost:3000');

class Chat extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.state = {
      text: '',
      cache: [],
      isTyping: false,
      currentUserTyping: ''
    };
  }

  handleChange(e) {
    socket.emit('message.typing', {
      user: localStorage.username
    });
    this.setState({ text: e.target.value });
  }

  handleKeyUp() {
    socket.emit('message.typing', {
      user: localStorage.username
    });
  }

  handleEnterKeyPress(e) {
    if (e.key === 'Enter') {
      // send the message to db / cache
      // socket emit

      socket.emit('message.send', {
        text: this.state.text,
        user: localStorage.username,
        // hard coded lounge
        lounge: this.props.data.localData.lounges[2],
        createdAt: new Date()
      });
      this.setState({ text: '' });
    }
  }

  isTyping(user) {
    let { isTyping } = this.state;
    if (isTyping) {
      return <div>{user} is typing...</div>;
    } else {
      return (
        <div>
          <br />
        </div>
      );
    }
  }

  componentDidMount() {
    socket.emit('user.enter', {
      user: localStorage.username
    });
    socket.on('message.send', msg => {
      this.setState({ cache: [...this.state.cache, msg] });
    });
    socket.on('message.typing', msg => {
      this.setState({
        isTyping: true,
        currentUserTyping: msg.user
      });
      setTimeout(() => {
        this.setState({ isTyping: false });
      }, 750);
    });
  }

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
                    <p>
                      {message.user}:
                      <span>({moment(message.createdAt).format('LT')})</span>
                    </p>
                    <p>{message.text}</p>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
            <ListGroup>
              {this.state.cache.map((message, i) => {
                return (
                  <ListGroupItem key={i}>
                    <p>
                      {message.user}:
                      <span>({moment(message.createdAt).format('LT')})</span>
                    </p>
                    <p>{message.text}</p>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Panel>
          {this.isTyping(this.state.currentUserTyping)}
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
              onKeyUp={this.handleKeyUp}
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
