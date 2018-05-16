import React, { Component } from "react";
import { Grid, Col, Row, Button, Navbar, Nav, NavItem } from "react-bootstrap";
import SearchBets from "../SearchBets/index.jsx";
import Chat from "../Chat/Chat.jsx";
import ESportVid from "../ESport/ESportVid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchHomeData, setMainComponent } from "../../actions";
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
      videoActive: false,
      gamesList: ["Fortnite", "Overwatch", "Rocket League", "PUBG"]
    };

    this.showBetsComponent = this.showBetsComponent.bind(this);
    this.showChatComponent = this.showChatComponent.bind(this);
    this.showVideoComponent = this.showVideoComponent.bind(this);
    this.mainComponentSelectorHandler = this.mainComponentSelectorHandler.bind(
      this
    );
    this.mainComponentRender = this.mainComponentRender.bind(this);
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

  mainComponentSelectorHandler(componentName) {
    const { local, setMainComponent } = this.props;
    console.log("local: ", local);
    setMainComponent(local, componentName);
  }

  mainComponentRender(componentName) {
    const components = {
      chat: <Chat /> || null,
      video: <ESportVid /> || null,
      bets:
        this.state.showVideo &&
        this.state.gamesList.includes(this.props.local.club.name) ? (
          <SearchBets betSocket={this.props.betSocket} />
        ) : null
    };
    return components[componentName];
  }

  /*
        {this.state.showBets ? (
          <SearchBets betSocket={this.props.betSocket} />
        ) : null}
        {this.state.showChat ? <Chat /> : null}
        {this.state.showVideo &&
        this.state.gamesList.includes(this.props.local.club.name) ? (
          <ESportVid />
        ) : null}
  */

  // async componentDidMount() {
  //   const { global, local, fetchHomeData, setMainComponent } = this.props;

  //   await setMainComponent(local);
  //   console.log("local data: ", local);
  // }

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
            // onClick={this.showChatComponent}
            onClick={() => this.mainComponentSelectorHandler("chat")}
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
            // onClick={this.showBetsComponent}
            onClick={() => this.mainComponentSelectorHandler("bets")}
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
            // onClick={this.showVideoComponent}
            onClick={() => this.mainComponentSelectorHandler("video")}
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
        {/*
        {this.state.showBets ? (
          <SearchBets betSocket={this.props.betSocket} />
        ) : null}
        {this.state.showChat ? <Chat /> : null}
        {this.state.showVideo &&
        this.state.gamesList.includes(this.props.local.club.name) ? (
          <ESportVid />
        ) : null}
        */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    local: state.local.localData
  };
};

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      fetchHomeData: fetchHomeData,
      setMainComponent: setMainComponent
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(MainNavBar);
