import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import "./index.css";

class NotificationMessage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="notification-wrapper">
        <div class="box logo">A</div>
        <div class="box message">B</div>
        {/* <ListGroupItem className="notification">
          <div className="notification-logo-wrapper">
            <Image
              className="notification-logo"
              src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/7320.jpg"
              circle
            />
          </div>
          <div className="notification-message-wrapper">
            <p className="notification-message">
              Your bet with Derek: "Cavs win the Finals" is finished, report the
              results.
            </p>
          </div>
          <div className="notification-button-wrapper">
            <Button className="notification-button" bsStyle="success">
              Success
            </Button>
          </div>
        </ListGroupItem> */}
      </div>
    );
  }
}

export default NotificationMessage;
