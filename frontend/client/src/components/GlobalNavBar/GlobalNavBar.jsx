import React, { Component } from "react";
import {
  Col,
  Glyphicon,
  ButtonToolbar,
  Image,
  Dropdown,
  DropdownButton,
  MenuItem
} from "react-bootstrap";
import "./GlobalNavBar.css";
class GlobalNavBar extends Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("win_ratio");
    localStorage.removeItem("reputation");
    localStorage.removeItem("default_club");
    localStorage.removeItem("persist:root");
    document.cookie = "";
    this.props.history.push("/login");
  }

  render() {
    return (
      <div>
        <Col align="left" md={2}>
          <Image
            className="logo"
            src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/gwb-logo.png"
            rounded
          />
        </Col>
        <Col md={8} mdHidden={true} />
        <Col align="right" md={2}>
          {/* <ButtonToolbar > */}
          <Dropdown pullRight id={1}>
            <Dropdown.Toggle bsSize="large" className="glyph">
              <Glyphicon glyph="align-justify" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="menu">
              <MenuItem>Profile</MenuItem>
              <MenuItem>Notifications</MenuItem>
              <MenuItem>Leaderboard</MenuItem>
              <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          {/* </ButtonToolbar> */}
        </Col>
      </div>
    );
  }
}

export default GlobalNavBar;
