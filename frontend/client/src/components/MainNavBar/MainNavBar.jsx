import React, { Component } from "react";
import { Grid, Col, Row, Button, Navbar, Nav, NavItem } from "react-bootstrap";
import SearchBets from "../SearchBets/index.jsx";
import Chat from "../Chat/Chat.jsx";
import SportVid from "../SportVid/SportVid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchHomeData, setMainComponent } from "../../actions";
import { updateCurrentLounge } from "../../actions/loungeActions";
import "./MainNavBar.css";

class MainNavBar extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="main-component-wrapper">
        <nav className="nav-main">
          <div
            className={
              this.props.main.component === "chat"
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={() => this.props.setMainComponent("chat")}
          >
            <a
              href="#"
              className={
                this.props.main.component === "chat"
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Chat
            </a>
          </div>{" "}
          <div
            className={
              this.props.main.component === "bets" ||
              this.props.main.component === undefined
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={() => {
              this.props.setMainComponent("bets");
              this.props.updateCurrentLounge(this.props.currentLounge);
            }}
          >
            <a
              href="#"
              className={
                this.props.main.component === "bets" ||
                this.props.main.component === undefined
                  ? "nav-button-text-active"
                  : "nav-button-text"
              }
            >
              Wagers
            </a>
          </div>{" "}
          <div
            className={
              this.props.main.component === "video"
                ? "main-nav-button-active"
                : "main-nav-button"
            }
            onClick={() => this.props.setMainComponent("video")}
          >
            <a
              href="#"
              className={
                this.props.main.component === "video"
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
    local: state.local.localData,
    main: state.component,
    currentLounge: state.currentLounge
  };
};

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      fetchHomeData: fetchHomeData,
      setMainComponent: setMainComponent,
      updateCurrentLounge: updateCurrentLounge
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(MainNavBar);
