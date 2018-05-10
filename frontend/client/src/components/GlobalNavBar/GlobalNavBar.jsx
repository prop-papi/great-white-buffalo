import React, { Component } from "react";
import {
  Col,
  Glyphicon,
  ButtonToolbar,
  Image,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
  NavDropdown,
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
        <Navbar className="nav-bar">
          <Navbar.Header>
            <Navbar.Brand>
              <Image
                className="logo"
                src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/gwb-logo.png"
                rounded
              />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav pullRight>
            <Navbar.Collapse className="glyph">
              <NavDropdown title={<Glyphicon glyph="align-justify" />}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Notifications</MenuItem>
                <MenuItem>Leaderboard</MenuItem>
                <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
              </NavDropdown>
            </Navbar.Collapse>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default GlobalNavBar;
