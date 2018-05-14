import React, { Component } from "react";
import "./GlobalNavBar.css";
import {
  Image,
  Dropdown,
  MenuItem,
  Glyphicon,
  CustomToggle,
  CustomMenu
} from "react-bootstrap";
import { connect } from "react-redux";
import NotificationMessage from "./../Notifications/NotificationMessage.jsx";
import FriendRequest from "./../Notifications/FriendRequest.jsx";
import BetResolveMessage from "./../Notifications/BetResolveMessage.jsx";
import BetResolveInput from "./../Notifications/BetResolveInput.jsx";

class GlobalNavBar extends Component {
  constructor() {
    super();

    this.state = {
      showMenu: false,
      showNotifications: false
    };

    this.showMenu = this.showMenu.bind(this);
    this.showNotificationList = this.showNotificationList.bind(this);
  }

  showMenu() {
    // change state here
    this.setState({ showMenu: !this.state.showMenu, showNotifications: false });
  }

  showNotificationList() {
    // change state here
    this.setState({
      showNotifications: !this.state.showNotifications,
      showMenu: false
    });
  }

  logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("win_ratio");
    localStorage.removeItem("reputation");
    localStorage.removeItem("default_club");
    localStorage.removeItem("persist:root");
    document.cookie = "";
    this.props.history.push("/login");
  }

  render() {
    return (
      <ul className="horizontal-list" role="navigation">
        <li className="logo li">
          <Image
            className="logo"
            src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/gwb-logo.png"
            rounded
          />
        </li>
        <li className="li right">
          <span className="label win-ratio">
            Wager Win Ratio:{" "}
            {(Number(localStorage.getItem("win_ratio")) * 100)
              .toString()
              .slice(0, 5)}
            {"%"}
          </span>
        </li>
        <li className="li notify-icon">
          <div className="notifications-wrapper">
            <i
              className="fa fa-exclamation-circle"
              style={{ fontSize: "30px" }}
              onClick={this.showNotificationList}
            />
            {this.state.showNotifications ? (
              <div className="notifications">
                {this.props.global.globalData.notifications.map(n => {
                  if (n.type === 0) {
                    return <NotificationMessage key={n.id} data={n} />;
                  } else if (n.type === 2) {
                    return <FriendRequest key={n.id} data={n} />;
                  } else if (n.type === 1) {
                    return <BetResolveInput key={n.id} data={n} />;
                  }
                })}
              </div>
            ) : null}
          </div>
        </li>
        <li className="li right">
          <Glyphicon
            glyph="align-justify"
            className="menu-dropdown"
            onClick={this.showMenu}
          />
          {this.state.showMenu ? (
            <div className="dropdown-content">
              <a href="#">Profile</a>
              <a href="#">Leaderboards</a>
              <a href="#" onClick={() => this.logout()}>
                Logout
              </a>
            </div>
          ) : null}
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    //globalData: state.globalData,
    global: state.global
  };
}

export default connect(mapStateToProps)(GlobalNavBar);
