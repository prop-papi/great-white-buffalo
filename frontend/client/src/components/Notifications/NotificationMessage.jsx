import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import "./index.css";

class NotificationMessage extends Component {
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
              src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/gwb-logo.png"
              rounded
            />
          </li>
          <li className="li li-message">
            <p className="notification-message">
              {this.props.data.partner_username} accepted your friend request!
            </p>
          </li>
        </ul>
      </div>
    );
  }
}

export default NotificationMessage;
