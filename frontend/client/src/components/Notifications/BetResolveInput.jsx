import React, { Component } from "react";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import "./index.css";

class BetResolveInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
            <p className="notification-message-request">
              Your bet: <strong>{this.props.data.description}</strong> with{" "}
              {this.props.data.partner_username} is completed and ready to be
              resolved! Review your bet to give us the outcome.
            </p>
          </li>
          <li className="button-list-item">
            <Button className="bet-resolve-button-top" bsStyle="primary">
              Win
            </Button>
            <Button className="bet-resolve-button-bottom" bsStyle="warning">
              Loss
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}

export default BetResolveInput;
