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
      activeTab: "bets",
      gamesList: ["Fortnite", "Overwatch", "Rocket League", "PUBG"]
    };

    this.selectTabHandler = this.selectTabHandler.bind(this);
  }

  selectTabHandler(componentName) {
    // const { local, setMainComponent } = this.props;
    this.props.setMainComponent(this.props.local, componentName);
    this.setState({
      activeTab: componentName
    });
  }

  render() {
    return (
      <div className="main-component-wrapper">
        <nav className="nav-main">
          <div
            className={
              this.state.activeTab === "chat"
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={() => this.selectTabHandler("chat")}
          >
            <a
              href="#"
              className={
                this.state.activeTab === "chat"
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Chat
            </a>
          </div>{" "}
          <div
            className={
              this.state.activeTab === "bets"
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={() => this.selectTabHandler("bets")}
          >
            <a
              href="#"
              className={
                this.state.activeTab === "bets"
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Wagers
            </a>
          </div>{" "}
          <div
            className={
              this.state.activeTab === "video"
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={() => this.selectTabHandler("video")}
          >
            <a
              href="#"
              className={
                this.state.activeTab === "video"
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Video
            </a>
          </div>{" "}
        </nav>
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
