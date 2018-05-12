import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import "./index.css";

class FriendRequest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
            <Button className="notification-button" bsStyle="success">
              &#10003;
            </Button>
          </li>
          <li className="button-list-item">
            <Button className="notification-button" bsStyle="danger">
              &#10008;
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}

export default FriendRequest;
