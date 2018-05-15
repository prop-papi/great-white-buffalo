import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateNotifications } from "../../actions";
import "./index.css";

class FriendRequest extends Component {
  constructor() {
    super();

    this.state = {
      inputRecieved: false,
      accepted: false
    };

    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.declineFriendRequest = this.declineFriendRequest.bind(this);
  }

  async acceptFriendRequest() {
    // update notifications table to viewed = 1, trigger a new notification, update friends table
    // update accepted
    let body = {
      user1: this.props.data.owner_id,
      user2: this.props.data.partner_id,
      status: 1,
      id: this.props.data.id
    };
    this.setState({ accepted: true, inputRecieved: true });
    try {
      const data = await axios.post(
        `http://localhost:1337/api/notifications/friendRequestResponse`,
        body
      );
      console.log("about to call function");
      this.props.updateNotifications(localStorage.id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async declineFriendRequest() {
    let body = {
      user1: this.props.data.owner_id,
      user2: this.props.data.partner_id,
      status: 2,
      id: this.props.data.id
    };
    this.setState({ inputRecieved: true });
    try {
      const data = await axios.post(
        `http://localhost:1337/api/notifications/friendRequestResponse`,
        body
      );
      this.props.updateNotifications(localStorage.id);
    } catch (err) {
      throw new Error(err);
    }
  }

  render() {
    if (!this.state.inputRecieved) {
      return (
        <div className="notification-wrapper">
          <ul className="horizontal-list notifications-list" role="navigation">
            <li className="logo li">
              <Image
                className="notification-logo"
                src={this.props.data.partner_picture}
                rounded
              />
            </li>
            <li className="li li-message">
              <p className="notification-message-request">
                {this.props.data.partner_username} wants to be your friend.
              </p>
            </li>
            <li className="button-list-item">
              <Button
                className="notification-button"
                bsStyle="success"
                onClick={this.acceptFriendRequest}
              >
                &#10003;
              </Button>
            </li>
            <li className="button-list-item">
              <Button
                className="notification-button"
                bsStyle="danger"
                onClick={this.declineFriendRequest}
              >
                &#10008;
              </Button>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="notification-wrapper">
          <ul className="horizontal-list notifications-list" role="navigation">
            <li className="logo li">
              <Image
                className="notification-logo"
                src={this.props.data.partner_picture}
                rounded
              />
            </li>
            <li className="li li-message">
              <p className="notification-message">
                {this.state.accepted ? (
                  <span>
                    You accepted {this.props.data.partner_username}'s friend
                    request!
                  </span>
                ) : (
                  <span>
                    You declined {this.props.data.partner_username}'s friend
                    request..
                  </span>
                )}
              </p>
            </li>
          </ul>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    // global: state.global
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateNotifications: updateNotifications
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(FriendRequest);
