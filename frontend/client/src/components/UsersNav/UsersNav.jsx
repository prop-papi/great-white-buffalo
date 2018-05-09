import React, { Component } from "react";
import { Grid, Col, Row, Button } from "react-bootstrap";
import "../MainNavBar/MainNavBar.css";

class UsersNav extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Row className="nav-row">
          <Col align="center" md={6}>
            <Button>Users</Button>
          </Col>
          <Col align="center" md={6}>
            <Button>Friends</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UsersNav;
