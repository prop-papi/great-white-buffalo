import React, { Component } from "react";
import axios from "axios";
import { Image, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import "./SideProfile.css";
import Bet from "../Bet";

class SideProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFriend: "",
      myBets: [],
      isMe: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userPane.selectedUser.username === localStorage.username) {
      return {
        isMe: true,
        myBets: []
      };
    } else {
      return {
        isMe: false
      };
    }
  }

  async componentDidMount() {
    if (this.props.userPane.selectedUser.username !== localStorage.username) {
      await Promise.all([this.checkIfFriend(), this.findMyBets()]);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.isMe === false && this.state.isMe !== prevState.isMe) {
      await this.findMyBets();
    }
  }

  checkIfFriend() {
    let username = this.props.userPane.selectedUser.username;
    let found = false;

    this.props.pendingFriends.forEach(
      function(el) {
        if (el.username === username) {
          this.setState({ isFriend: "pending" });
          found = true;
        }
      }.bind(this)
    );

    if (!found) {
      for (let i = 0; i < this.props.friends.length; i++) {
        if (this.props.friends[i].username === username) {
          this.setState({ isFriend: "true" });
          break;
        } else {
          this.setState({ isFriend: "false" });
        }
      }
    }
  }

  findMyBets() {
    let myBets = [];
    const selectedUserName = this.props.userPane.selectedUser.username;
    this.props.global.bets.forEach(bet => {
      if (bet.creator_name === selectedUserName && bet.status === "pending") {
        myBets.push(bet);
      }
    });
    this.setState({ myBets });
  }

  handleFriend() {
    let user_1 = localStorage.id;
    let user_2 = this.props.userPane.selectedUser.id;
    if (this.state.isFriend === "true") {
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
    let friendText = "";
    if (this.state.isFriend === "true") {
      friendText = "Unfriend";
    } else if (this.state.isFriend === "false") {
      friendText = "Add Friend";
    } else {
      friendText = "Pending Response";
    }
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
            <br />
            {this.props.userPane.selectedUser.username !==
            localStorage.username ? (
              <Row>
                {this.state.isFriend === "pending" ? (
                  <span className="pending-message">{friendText}</span>
                ) : (
                  <Button
                    className="add-friend"
                    onClick={() => this.handleFriend()}
                  >
                    {friendText}
                  </Button>
                )}
              </Row>
            ) : null}
          </div>
          <br />
          <Row>
            {this.state.myBets.length === 0 && !this.state.isMe
              ? "This user has no open bets :("
              : !this.state.isMe && "Open Bets"}
          </Row>
          {this.state.myBets.map((bet, key) => {
            return <Bet bet={bet} key={key} />;
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userPane: state.userPane.userPaneData,
    global: state.global.globalData
  };
};

export default connect(mapStateToProps)(SideProfile);
