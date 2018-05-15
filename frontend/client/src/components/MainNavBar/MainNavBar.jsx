import React, { Component } from "react";
import { Grid, Col, Row, Button, Navbar, Nav, NavItem } from "react-bootstrap";
import SearchBets from "../SearchBets/index.jsx";
import Chat from "../Chat/Chat.jsx";
import "./MainNavBar.css";

class MainNavBar extends Component {
  constructor() {
    super();

    this.state = {
      showBets: true,
      showChat: false,
      showVideo: false,
      betsActive: true,
      chatActive: false,
      videoActive: false
    };

    this.showBetsComponent = this.showBetsComponent.bind(this);
    this.showChatComponent = this.showChatComponent.bind(this);
    this.showVideoComponent = this.showVideoComponent.bind(this);
  }

  showBetsComponent() {
    this.setState({
      showBets: true,
      betsActive: true,
      showChat: false,
      showVideo: false,
      videoActive: false,
      chatActive: false
    });
  }

  showChatComponent() {
    this.setState({
      showBets: false,
      showChat: true,
      chatActive: true,
      showVideo: false,
      betsActive: false,
      videoActive: false
    });
  }

  showVideoComponent() {
    this.setState({
      showBets: false,
      showChat: false,
      chatActive: false,
      showVideo: true,
      betsActive: false,
      videoActive: true
    });
  }

  render() {
    return (
      <div className="main-component-wrapper">
        <nav className="nav-main">
          <div
            className={
              this.state.chatActive
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={this.showChatComponent}
          >
            <a
              href="#"
              className={
                this.state.chatActive
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Chat
            </a>
          </div>{" "}
          <div
            className={
              this.state.betsActive
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={this.showBetsComponent}
          >
            <a
              href="#"
              className={
                this.state.betsActive
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Wagers
            </a>
          </div>{" "}
          <div
            className={
              this.state.videoActive
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={this.showVideoComponent}
          >
            <a
              href="#"
              className={
                this.state.videoActive
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Video
            </a>
          </div>{" "}
        </nav>
        {this.state.showBets ? (
          <SearchBets betSocket={this.props.betSocket} />
        ) : null}
        {this.state.showChat ? <Chat /> : null}
      </div>
    );
  }
}

export default MainNavBar;
