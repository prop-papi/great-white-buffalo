import React, { Component } from "react";
import axios from "axios";
import { Image, Row } from "react-bootstrap";
import "./SideProfile.css";

class SideProfile extends Component {
  constructor() {
    super();
    this.state = {
      user: "indabuff",
      selectedUser: {}
    };
    this.handleSelectedUser = this.handleSelectedUser.bind(this);
  }

  componentDidMount() {
    // Change this later be whoever was clicked on
    this.handleSelectedUser(this.state.user);
  }

  handleSelectedUser(name) {
    let params = {
      username: name
    };
    axios
      .get("http://localhost:1337/api/users/selected", { params })
      .then(response => {
        this.setState({ selectedUser: response.data[0] });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  render() {
    return (
      <div>
        <div className="side-profile">
          <Row>
            <Image src={this.state.selectedUser.picture} circle />
          </Row>
          <Row>{this.state.selectedUser.username}</Row>
          <div className="bio">
            <Row>Reputation: {this.state.selectedUser.reputation}%</Row>
            <br />
            <Row>{this.state.selectedUser.aboutMe}</Row>
            <br />
            <Row>
              {this.state.selectedUser.wins} Wins /{" "}
              {this.state.selectedUser.totalBets - this.state.selectedUser.wins}{" "}
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
