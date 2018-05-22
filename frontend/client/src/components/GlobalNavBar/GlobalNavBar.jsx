import React, { Component } from "react";
import "./GlobalNavBar.css";
import configs from "../../../../../config.js";
import {
  Image,
  Dropdown,
  MenuItem,
  Glyphicon,
  CustomToggle,
  CustomMenu
} from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setMainComponent } from "../../actions";
import { updateUserPaneData } from "../../actions/index";
import NotificationMessage from "./../Notifications/NotificationMessage.jsx";
import EmptyNotifications from "./../Notifications/EmptyNotifications.jsx";
import FriendRequest from "./../Notifications/FriendRequest.jsx";
import BetResolveMessage from "./../Notifications/BetResolveMessage.jsx";
import BetResultsMessage from "./../Notifications/BetResultsMessage.jsx";
import BetAcceptMessage from "./../Notifications/BetAcceptMessage.jsx";
import BetResolveInput from "./../Notifications/BetResolveInput.jsx";
import axios from "axios";

class GlobalNavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      showNotifications: false
    };

    this.showMenu = this.showMenu.bind(this);
    this.showNotificationList = this.showNotificationList.bind(this);
    this.handleNavItemCollapse = this.handleNavItemCollapse.bind(this);
    this.closeNotifications = this.closeNotifications.bind(this);
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleNavItemCollapse, false);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      this.handleNavItemCollapse,
      false
    );
  }

  closeNotifications() {
    this.setState({ showNotifications: false });
  }

  handleNavItemCollapse(e) {
    if (this.node !== undefined && this.node !== null) {
      if (
        !this.node.contains(e.target) &&
        e.target.className !== "fa fa-exclamation-circle nav-component" &&
        e.target.className !==
          "menu-dropdown nav-component glyphicon glyphicon-align-justify"
      ) {
        this.setState({
          showNotifications: false,
          showMenu: false
        });
      }
    }
  }

  showMenu() {
    // change state here
    this.setState({ showMenu: !this.state.showMenu, showNotifications: false });
  }

  async showNotificationList() {
    await this.setState({
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

  menuSelectHandler(componentName) {
    const { local, setMainComponent } = this.props;
    setMainComponent(local, componentName);
  }

  handleProfile(username) {
    let params = {
      username
    };
    axios
      .get(`${configs.HOST}api/userpane/selected`, { params })
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

  render() {
    return (
      <ul className="horizontal-list" role="navigation">
        <li className="logo li">
          <Image
            className="logo"
            src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/updated-favicon.png"
            rounded
          />
        </li>
        <li className="li right">
          <span className="label win-ratio">
            {this.props.global.globalData.balances[0].available_balance}
            {" tokens available  | "}
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
              className="fa fa-exclamation-circle nav-component"
              style={{ fontSize: "20px" }}
              onClick={this.showNotificationList}
              ref={node => (this.node = node)}
            />
            {this.state.showNotifications ? (
              <div className="notifications" ref={node => (this.node = node)}>
                {!this.props.notifications.notificationsData.length ? (
                  <EmptyNotifications />
                ) : null}
                {this.props.notifications.notificationsData.map(n => {
                  if (
                    n.type === 0 ||
                    n.type === 0.1 ||
                    n.type === 0.2 ||
                    n.type === 0.3
                  ) {
                    return (
                      <NotificationMessage
                        key={n.id}
                        data={n}
                        close={this.closeNotifications}
                      />
                    );
                  } else if (n.type === 2) {
                    return (
                      <FriendRequest
                        key={n.id}
                        data={n}
                        close={this.closeNotifications}
                        notificationsSocket={this.props.notificationsSocket}
                      />
                    );
                  } else if (n.type === 1) {
                    return (
                      <BetResolveMessage
                        key={n.id}
                        data={n}
                        close={this.closeNotifications}
                      />
                    );
                  } else if (n.type === 3) {
                    return (
                      <BetAcceptMessage
                        key={n.id}
                        data={n}
                        close={this.closeNotifications}
                      />
                    );
                  } else if (n.type === 4 || n.type === 4.1) {
                    return (
                      <BetResultsMessage
                        key={n.id}
                        data={n}
                        close={this.closeNotifications}
                      />
                    );
                  }
                })}
              </div>
            ) : null}
          </div>
        </li>
        <li className="li right">
          <Glyphicon
            glyph="align-justify"
            className="menu-dropdown nav-component"
            onClick={this.showMenu}
          />
          {this.state.showMenu ? (
            <div className="dropdown-content" ref={node => (this.node = node)}>
              <div
                className="dropdown-menu-item"
                onClick={() => this.handleProfile(localStorage.username)}
              >
                Profile
              </div>
              <div
                className="dropdown-menu-item"
                onClick={() => this.props.setMainComponent("leaderboard")}
              >
                Leaderboards
              </div>
              <div className="dropdown-menu-item" onClick={() => this.logout()}>
                Logout
              </div>
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
    local: state.local,
    global: state.global,
    notifications: state.notificationsData,
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      setMainComponent: setMainComponent,
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(GlobalNavBar);
