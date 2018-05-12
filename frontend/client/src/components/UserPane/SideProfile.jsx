import React, { Component } from "react";
import axios from "axios";
import { Image, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import "./SideProfile.css";

class SideProfile extends Component {
  constructor() {
    super();
    this.state = {
      isFriend: null
    };
  }

  componentDidMount() {
    this.checkIfFriend();
  }

  checkIfFriend() {
    let username = this.props.userPane.selectedUser.username;
    for (let i = 0; i < this.props.friends.length; i++) {
      if (this.props.friends[i].username === username) {
        this.setState({ isFriend: true });
        break;
      } else {
        this.setState({ isFriend: false });
      }
    }
  }

  handleFriend() {
    let user_1;
    let user_2;
    if (localStorage.id < this.props.userPane.selectedUser.id) {
      user_1 = localStorage.id;
      user_2 = this.props.userPane.selectedUser.id;
    }
    if (this.state.isFriend) {
      let body = {
        user_1,
        user_2
      };
      axios
        .post("http://localhost:1337/api/userpane/removeFriend", body)
        .then(response => {
          this.props.fetchFriends(localStorage.id);
          this.setState({ isFriend: false });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let body = {
        user_1,
        user_2,
        action_user: localStorage.id
      };
      axios
        .post("http://localhost:1337/api/userpane/addFriend", body)
        .then(response => {
          this.props.fetchFriends(localStorage.id);
          this.setState({ isFriend: true });
        })
        .catch(err => {
          console.log("Err: ", err);
        });
    }
    axios;
  }

  render() {
    let friendText = this.state.isFriend === true ? "Unfriend" : "Add Friend";
    return (
      <div>
        <div className="side-profile">
          <Row>
            <Image
              className="profile-img"
              src={this.props.userPane.selectedUser.picture}
              circle
            />
          </Row>
          <Row>{this.props.userPane.selectedUser.username}</Row>
          <div className="bio">
            <Row>
              Reputation: {this.props.userPane.selectedUser.reputation}%
            </Row>
            <br />
            <Row>{this.props.userPane.selectedUser.aboutMe}</Row>
            <br />
            <Row>
              {this.props.userPane.selectedUser.wins} Wins /{" "}
              {this.props.userPane.selectedUser.totalBets -
                this.props.userPane.selectedUser.wins}{" "}
              Losses
            </Row>
            <Row>
              <Button
                className="add-friend"
                onClick={() => this.handleFriend()}
              >
                {friendText}
              </Button>
            </Row>
          </div>
          <Row>Open Bets</Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userPane: state.userPane.userPaneData
  };
};

export default connect(mapStateToProps)(SideProfile);
