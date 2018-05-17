import React from "react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

class SocketNotification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.type === 1) {
      console.log("here");
      return () => {
        NotificationManager.info("Info message");
      };
    } else if (this.props.type === 2) {
      return NotificationManager.success("Success message", "Title here");
    } else if (this.props.type === 3) {
      return NotificationManager.error("Error message", "Click me!");
    } else {
      return null;
    }
  }
}

export default SocketNotification;
