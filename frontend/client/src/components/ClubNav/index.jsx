import React, { Component } from "react";

import {
  Nav,
  NavItem,
  NavItemProps,
  Image,
  ImageProps,
  Thumbnail,
  ThumbnailProps
} from "react-bootstrap";

import "./index.css";

class ClubNav extends Component {
  constructor() {
    super();
  }

  handleNavItemClick() {
    console.log("item clicked");
    // perform some routing and/or re-render new state of the page
  }

  render() {
    return (
      <div className="container">
        <Nav bsStyle="pills" stacked activeKey={1}>
          <NavItem
            className="nav-item"
            eventKey={1}
            onClick={this.handleNavItemClick}
          >
            <div className="club-logo-wrapper">
              <Image
                src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/7320.jpg"
                circle
                responsive
                className="nav-image"
              />
            </div>
          </NavItem>
          <NavItem
            className="nav-item"
            eventKey={2}
            onClick={this.handleNavItemClick}
          >
            <Image
              src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/7320.jpg"
              circle
              responsive
              className="nav-image"
            />
          </NavItem>
          <NavItem
            className="nav-item"
            eventKey={3}
            onClick={this.handleNavItemClick}
          >
            <Image
              src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/7320.jpg"
              circle
              responsive
              className="nav-image"
            />
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default ClubNav;
