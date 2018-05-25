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
import configs from "../../../../../config.js";
import { updateUserPaneData } from "../../actions";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";

// custom css
import "./Chat.css";

// connection to socket server
const socket = io(`${configs.SOCKET_HOST}chatSocket`);

class Chat extends Component {
  constructor(props) {
    super(props);

    this.displaySideProfile = this.displaySideProfile.bind(this);
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

  displaySideProfile(target) {
    let params = {
      username: target.currentTarget.innerHTML
    };
    axios
      .get(`${configs.HOST}api/userpane/selected`, { params })
      .then(response => {
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
    if (e.key === "Enter") {
      const payload = {
        text: this.state.text,
        user: localStorage.username,
        currentLoungeID: this.props.currentLounge.currentLounge.id,
        media: "",
        createdAt: new Date()
      };

      socket.emit("message.send", payload);
      this.setState({ text: "" });
      axios
        .post(`${configs.HOST}api/message/send`, payload)
        .then(response => {
          console.log("Server response: ", response);
        })
        .catch(error => {
          console.log("Server error: ", error);
        });
    }
  }

  isTyping(user) {
    let { isTyping } = this.state;
    if (isTyping) {
      return (
        <Row>
          <Col xs={2} sm={1.5} md={1.25} lg={1} />
          <Col xs={10} sm={10.5} md={10.75} lg={11} className="chat-username">
            <a>{user}</a> typing...
          </Col>
        </Row>
      );
    }
  }

  scrollToBottom = () => {
    this.messagesEnd && this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  async componentWillReceiveProps(newProps) {
    await socket.emit("user.leave", {
      user: localStorage.username,
      previousLoungeID: this.props.currentLounge.currentLounge.id
    });

    socket.emit("user.enter", {
      user: localStorage.username,
      currentLoungeID: newProps.currentLounge.currentLounge.id
    });
  }

  componentDidMount() {
    socket.emit("user.enter", {
      user: localStorage.username,
      currentLoungeID: this.props.currentLounge.currentLounge.id
    });

    socket.on(`user.enter.${localStorage.username}`, async msg => {
      await this.setState({ recent50Messages: msg });
      this.scrollToBottom();
    });

    socket.on("message.send", msg => {
      this.setState({ cache: [...this.state.cache, msg] });
      this.scrollToBottom();
    });

    socket.on("message.typing", msg => {
      if (!this.state.currentUserTyping) {
        this.setState({
          isTyping: true,
          currentUserTyping: `${msg.user} is`
        });
      } else if (this.state.currentUserTyping === "a few people are") {
        return;
      } else {
        this.setState({
          currentUserTyping: "a few people are"
        });
      }
      setTimeout(() => {
        this.setState({
          isTyping: false,
          currentUserTyping: null
        });
      }, 2000);
    });

    socket.on(`${localStorage.username}.leave`, async payload => {
      await this.setState({ cache: [] });
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
                    <a
                      className="message-username"
                      onClick={this.displaySideProfile}
                    >
                      {msg.user}
                    </a>: {msg.text}
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
            {this.isTyping(this.state.currentUserTyping)}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </Grid>
        </div>
        <div className="message-input">
          <FormControl
            type="text"
            value={this.state.text}
            placeholder={`Chatting in ${
              this.props.currentLounge.currentLounge.name
            }`}
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
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Chat);
