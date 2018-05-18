import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserPaneData } from "../../actions";
import axios from "axios";
import "./index.css";

class NotificationMessage extends Component {
  constructor(props) {
    super(props);

    this.displaySideProfile = this.displaySideProfile.bind(this);
  }

  displaySideProfile(target) {
    let params = {
      username: target.currentTarget.innerHTML
    };
    this.props.close();
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

  render() {
    if (this.props.data.type === 0) {
      return (
        <div className="notification-wrapper">
          <ul className="horizontal-list notifications-list" role="navigation">
            <li className="logo-li-item li">
              <Image
                className="notification-logo"
                src={this.props.data.partner_picture}
                rounded
              />
            </li>
            <li className="li li-message">
              <p className="notification-message">
                <strong>
                  <span
                    className="user-in-message"
                    onClick={this.displaySideProfile}
                  >
                    {this.props.data.partner_username}
                  </span>
                </strong>{" "}
                accepted your friend request!
              </p>
            </li>
          </ul>
        </div>
      );
    } else if (this.props.data.type === 0.1) {
      return (
        <div className="notification-wrapper">
          <ul className="horizontal-list notifications-list" role="navigation">
            <li className="logo-li-item li">
              <Image
                className="notification-logo"
                src={this.props.data.partner_picture}
                rounded
              />
            </li>
            <li className="li li-message">
              <p className="notification-message">
                You accepted{" "}
                <strong>
                  <span
                    className="user-in-message"
                    onClick={this.displaySideProfile}
                  >
                    {this.props.data.partner_username}
                  </span>'s
                </strong>{" "}
                friend request!
              </p>
            </li>
          </ul>
        </div>
      );
    } else if (this.props.data.type === 0.2) {
      return (
        <div className="notification-wrapper">
          <ul className="horizontal-list notifications-list" role="navigation">
            <li className="logo-li-item li">
              <Image
                className="notification-logo"
                src={this.props.data.partner_picture}
                rounded
              />
            </li>
            <li className="li li-message">
              <p className="notification-message">
                <strong>
                  <span
                    className="user-in-message"
                    onClick={this.displaySideProfile}
                  >
                    {this.props.data.partner_username}
                  </span>
                </strong>{" "}
                declined your friend request...
              </p>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="notification-wrapper">
          <ul className="horizontal-list notifications-list" role="navigation">
            <li className="logo-li-item li">
              <Image
                className="notification-logo"
                src={this.props.data.partner_picture}
                rounded
              />
            </li>
            <li className="li li-message">
              <p className="notification-message">
                You declined{" "}
                <strong>
                  <span
                    className="user-in-message"
                    onClick={this.displaySideProfile}
                  >
                    {this.props.data.partner_username}
                  </span>'s
                </strong>{" "}
                friend request..
              </p>
            </li>
          </ul>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, bindActionsToDispatch)(
  NotificationMessage
);
