import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormControl, ListGroup, ListGroupItem, Panel } from "react-bootstrap";
import moment from "moment";
import io from "socket.io-client";

// custom css
import "./Chat.css";

// connection to socket server
const socket = io("http://localhost:3000");

class Chat extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.isTyping = this.isTyping.bind(this);

    this.state = {
      text: "",
      recent50Messages: [],
      cache: [],
      isTyping: false,
      currentUserTyping: ""
    };
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
    if (e.key !== "Enter") {
      socket.emit("message.typing", {
        user: localStorage.username,
        currentLoungeID: this.props.currentLounge.currentLounge.id
      });
    }
  }

  handleEnterKeyPress(e) {
    if (e.key === "Enter") {
      socket.emit("message.send", {
        text: this.state.text,
        user: localStorage.username,
        currentLoungeID: this.props.currentLounge.currentLounge.id,
        createdAt: new Date()
      });
      this.setState({ text: "" });
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
    socket.emit("user.enter", {
      user: localStorage.username,
      currentLoungeID: this.props.currentLounge.currentLounge.id
    });

    socket.on(`user.enter.${localStorage.username}`, msg => {
      this.setState({ recent50Messages: msg.reverse() });
    });

    socket.on("message.send", msg => {
      this.setState({ cache: [...this.state.cache, msg] });
    });

    socket.on("message.typing", msg => {
      this.setState({
        isTyping: true,
        currentUserTyping: msg.user
      });
      setTimeout(() => {
        this.setState({ isTyping: false });
      }, 1500);
    });
  }

  render() {
    return (
      <div>
        <h1 className="main-component-nav">MAIN COMPONENT NAV BAR GOES HERE</h1>
        <br />
        <div className="chat-main-container">
          <Panel>
            <ul>
              {this.state.recent50Messages.map((message, i) => {
                let msg = JSON.parse(message);
                return (
                  <li key={i}>
                    {msg.user}:{" "}
                    <span>({moment(msg.createdAt).format("LT")})</span>
                    <br />
                    {msg.text}
                  </li>
                );
              })}
              {this.state.cache.map((message, i) => {
                return (
                  <li key={i}>
                    {message.user}:{" "}
                    <span>({moment(message.createdAt).format("LT")})</span>
                    <br />
                    {message.text}
                  </li>
                );
              })}
            </ul>
          </Panel>
          {this.isTyping(this.state.currentUserTyping)}
          <Panel>
            <FormControl
              type="text"
              value={this.state.text}
              placeholder={`Chatting in ${
                this.props.currentLounge.currentLounge.name
              }`}
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
    // message: state.message,
    // data: state.data,
    global: state.global,
    local: state.local,
    currentLounge: state.currentLounge
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
