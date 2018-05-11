import React, { Component } from "react";
import axios from "axios";
import { Image, Row } from "react-bootstrap";
import "./SideProfile.css";

class SideProfile extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div className="side-profile">
          <Row>
            <Image
              className="profile-img"
              src={this.props.selectedUser.picture}
              circle
            />
          </Row>
          <Row>{this.props.selectedUser.username}</Row>
          <div className="bio">
            <Row>Reputation: {this.props.selectedUser.reputation}%</Row>
            <br />
            <Row>{this.props.selectedUser.aboutMe}</Row>
            <br />
            <Row>
              {this.props.selectedUser.wins} Wins /{" "}
              {this.props.selectedUser.totalBets - this.props.selectedUser.wins}{" "}
              Losses
            </Row>
          </div>
          <Row>Open Bets</Row>
        </div>
      </div>
    );
  }
}

export default SideProfile;
