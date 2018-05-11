import React, { Component } from "react";
import { ListGroup, ListGroupItem, Grid, Row, Col } from "react-bootstrap";
import NotificationMessage from "./NotificationMessage.jsx";
import "./index.css";

class NotificationContainer extends Component {
  constructor() {
    super();

    this.state = {
      showNotifications: false
    };

    this.showNotificationList = this.showNotificationList.bind(this);
  }

  showNotificationList() {
    // change state here
    this.setState({ showNotifications: !this.state.showNotifications });
  }

  render() {
    return (
      <div className="notification-container-wrapper">
        <span className="lounge-name">
          <i
            className="fa fa-exclamation-circle"
            style={{ fontSize: "30px" }}
            onClick={this.showNotificationList}
          />
        </span>
        {this.state.showNotifications ? (
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={8}>
                <code>&lt;{"Col xs={12} md={8}"} /&gt;</code>
              </Col>
              <Col xs={6} md={4}>
                <code>&lt;{"Col xs={6} md={4}"} /&gt;</code>
              </Col>
            </Row>
          </Grid>
        ) : null}
      </div>
    );
  }
}

export default NotificationContainer;
