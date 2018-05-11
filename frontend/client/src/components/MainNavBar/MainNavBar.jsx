import React, { Component } from "react";
import { Grid, Col, Row, Button } from "react-bootstrap";
import "./MainNavBar.css";

class MainNavBar extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Row className="nav-row">
          <Col align="center" md={4}>
            <Button className="nav-button">Video</Button>
          </Col>
          <Col align="center" md={4}>
            <Button className="nav-button">Wagers</Button>
          </Col>
          <Col align="center" md={4}>
            <Button className="nav-button">Chat</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MainNavBar;
