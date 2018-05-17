import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateNotifications, updateUserPaneData } from "../../actions";
import "./index.css";

class FriendRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputRecieved: false,
      accepted: false
    };

    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.declineFriendRequest = this.declineFriendRequest.bind(this);
    this.displaySideProfile = this.displaySideProfile.bind(this);
    this.testSocket = this.testSocket.bind(this);
  }

  testSocket() {
    const payload = {
      user: localStorage.username,
      friend: this.props.data.partner_username
    };
    this.props.notificationsSocket.emit("fr-declined", payload);
  }

  displaySideProfile(target) {
    let params = {
      username: target.currentTarget.innerHTML
    };
    this.props.close();
    axios
      .get("http://localhost:1337/api/userpane/selected", { params })
      .then(response => {
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        newUserPane.selectedUser = response.data[0];
        this.props.updateUserPaneData(newUserPane);
        this.props.close();
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  async acceptFriendRequest() {
    let body = {
      user1: this.props.data.owner_id,
      user2: this.props.data.partner_id,
      status: 1,
      id: this.props.data.id
    };
    this.setState({ accepted: true, inputRecieved: true });
    try {
      // trigger socket notification here
      const data = await axios.post(
        `http://localhost:1337/api/notifications/friendRequestResponse`,
        body
      );
      this.props.updateNotifications(localStorage.id);
      const payload = {
        user: localStorage.username,
        friend: this.props.data.partner_username
      };
      this.props.notificationsSocket.emit("fr-accepted", payload);
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
      // trigger socket notification here
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
                <strong>
                  <span
                    className="user-in-message"
                    onClick={this.displaySideProfile}
                  >
                    {this.props.data.partner_username}
                  </span>
                </strong>{" "}
                wants to be your <span onClick={this.testSocket}>friend</span>.
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
                  </span>
                ) : (
                  <span>
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
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateNotifications: updateNotifications,
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(FriendRequest);
