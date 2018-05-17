import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FormControl,
  ListGroup,
  ListGroupItem,
  Panel,
  Grid,
  Row,
  Col
} from "react-bootstrap";
import { updateUserPaneData } from "../../actions";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";

// custom css
import "./Chat.css";

// connection to socket server
const socket = io("http://localhost:3000/chat");

class Chat extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.displaySideProfile = this.displaySideProfile.bind(this);

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

  displaySideProfile(target) {
    let params = {
      username: target.currentTarget.innerHTML
    };
    axios
      .get("http://localhost:1337/api/userpane/selected", { params })
      .then(response => {
        //this.setState({ selectedUser: response.data[0] });
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        newUserPane.selectedUser = response.data[0];
        this.props.updateUserPaneData(newUserPane);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  handleEnterKeyPress(e) {
    const payload = {
      text: this.state.text,
      user: localStorage.username,
      currentLoungeID: this.props.currentLounge.currentLounge.id,
      createdAt: new Date()
    };

    if (e.key === "Enter") {
      socket.emit("message.send", payload);
      this.setState({ text: "" });
      // axios
      //   .post("/message", payload)
      //   .then(response => {
      //     console.log("Server response: ", response);
      //   })
      //   .catch(error => {
      //     console.log("Server error: ", error);
      //   });
    }
  }

  isTyping(user) {
    let { isTyping } = this.state;
    if (isTyping) {
      return (
        <Row>
          <Col xs={2} sm={1.5} md={1.25} lg={1} />
          <Col xs={10} sm={10.5} md={10.75} lg={11} className="chat-username">
            <a>{user} </a>is typing...
          </Col>
        </Row>
      );
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentWillReceiveProps(newProps) {
    if (
      this.props.currentLounge.currentLounge.id !==
      newProps.currentLounge.currentLounge.id
    ) {
      this.setState({
        cache: []
      });

      socket.emit("user.enter", {
        user: localStorage.username,
        currentLoungeID: this.props.currentLounge.currentLounge.id
      });

      socket.on(`user.enter.${localStorage.username}`, msg => {
        this.setState({ recent50Messages: msg.reverse() });
        this.scrollToBottom();
      });

      socket.on("message.send", msg => {
        this.setState({ cache: [...this.state.cache, msg] });
        this.scrollToBottom();
      });

      socket.on("message.typing", msg => {
        if (!this.currentUserTyping) {
          this.setState({
            isTyping: true,
            currentUserTyping: msg.user
          });
        }
        setTimeout(() => {
          this.setState({
            isTyping: false,
            currentUserTyping: null
          });
        }, 1500);
      });
    }
  }

  componentDidMount() {
    console.log("this.props.currentLounge:", this.props.currentLounge);
    console.log("this.props.local:", this.props.local);
    console.log("this.props:", this.props);
    socket.emit("user.enter", {
      user: localStorage.username,
      currentLoungeID: this.props.currentLounge.currentLounge.id
    });

    socket.on(`user.enter.${localStorage.username}`, msg => {
      this.setState({ recent50Messages: msg.reverse() });
      this.scrollToBottom();
    });

    socket.on("message.send", msg => {
      this.setState({ cache: [...this.state.cache, msg] });
      this.scrollToBottom();
    });

    socket.on("message.typing", msg => {
      if (!this.currentUserTyping) {
        this.setState({
          isTyping: true,
          currentUserTyping: msg.user
        });
      }
      setTimeout(() => {
        this.setState({
          isTyping: false,
          currentUserTyping: null
        });
      }, 1500);
    });
  }

  render() {
    return (
      <div className="chat-background">
        <div className="chat-main-container">
          <Grid className="chat-display">
            {this.state.recent50Messages.map((message, i) => {
              let msg = JSON.parse(message);
              return (
                <Row key={i}>
                  <Col xs={2} sm={1.5} md={1.25} lg={1} className="time-stamp">
                    ({moment(msg.createdAt).format("LT")}) {"  "} |
                  </Col>
                  <Col
                    xs={10}
                    sm={10.5}
                    md={10.75}
                    lg={11}
                    className="chat-username"
                  >
                    <a>{msg.user}: </a>
                    {msg.text}
                  </Col>
                </Row>
              );
            })}
            {this.state.cache.map((message, i) => {
              return (
                <Row key={i} className="message-row">
                  <Col xs={2} sm={1.5} md={1.25} lg={1} className="time-stamp">
                    ({moment(message.createdAt).format("LT")}) {"  "} |
                  </Col>
                  <Col
                    xs={10}
                    sm={10.5}
                    md={10.75}
                    lg={11}
                    className="chat-username"
                  >
                    <a
                      className="message-username"
                      onClick={this.displaySideProfile}
                    >
                      {message.user}
                    </a>: {message.text}
                  </Col>
                </Row>
              );
            })}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            />
            {this.isTyping(this.state.currentUserTyping)}
          </Grid>
        </div>
        <div className="message-input">
          <FormControl
            type="text"
            value={this.state.text}
            placeholder={`Chatting in ${
              // "hello"
              this.props.currentLounge.currentLounge.name
            }`}
            // could also dynamically render "Lounge" vs a "Direct Message"
            // Chatting in  LOUNGE_NAME
            // Chatting with  @USER (Direct Message)
            onChange={this.handleChange}
            onKeyPress={this.handleEnterKeyPress}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
    local: state.local,
    currentLounge: state.currentLounge,
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      // setTestData: setTestData
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Chat);
