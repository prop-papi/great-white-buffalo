import React, { Component } from "react";
import "./index.css";

class EmptyNotifications extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notification-wrapper">
        <ul className="horizontal-list notifications-list" role="navigation">
          <li className="li li-message">
            <p className="empty-notification-message">
              You don't have any notifications yet.
            </p>
          </li>
        </ul>
      </div>
    );
  }
}

export default EmptyNotifications;
