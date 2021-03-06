import React, { Component } from "react";
import configs from "../../../../../config.js";
import { Row, Image } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserPaneData } from "../../actions/index";
import SideProfile from "./SideProfile";
import axios from "axios";
import io from "socket.io-client";

const socket = io(`${configs.SOCKET_HOST}activeUsersSocket`);

class UserPane extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      friends: [],
      pendingFriends: []
    };
  }

  componentDidMount() {
    this.fetchAllClubUsers(this.props.local.club.id);
    this.fetchAllFriends(localStorage.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.local.club.id !== this.props.local.club.id) {
      this.fetchAllClubUsers(this.props.local.club.id);
    }
  }

  fetchAllClubUsers(id) {
    const params = {
      clubID: id,
      currUser: localStorage.username
    };
    axios
      .get(`${configs.HOST}api/userpane/allUsers`, { params })
      .then(response => {
        let users = [];
        response.data.forEach(user => {
          users.push(user.username);
        });
        this.setState({ users });
      })
      .catch(err => {
        console.log(err);
      });
  }

  fetchAllFriends(id) {
    const params = {
      id
    };
    axios
      .get(`${configs.HOST}api/userpane/friends`, { params })
      .then(response => {
        let friends = [];
        let pendingFriends = [];
        response.data.forEach(val => {
          if (val.status === 1) {
            val.user1 === localStorage.username
              ? friends.push(val.user2)
              : friends.push(val.user1);
          } else {
            val.user1 === localStorage.username
              ? pendingFriends.push(val.user2)
              : pendingFriends.push(val.user1);
          }
        });
        this.setState({
          friends,
          pendingFriends
        });
        this.setState({ friends });
      })
      .catch(err => {
        console.log("Error fetching friends", err);
      });
  }

  handleSelectedUser(username) {
    let params = {
      username
    };

    axios
      .get(`${configs.HOST}api/userpane/selected`, { params })
      .then(response => {
        //this.setState({ selectedUser: response.data[0] });
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        newUserPane.selectedUser = response.data[0];
        this.props.updateUserPaneData(newUserPane);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  handleOnlineUsers(users) {
    let offline = [];
    let online = [];
    users.forEach(user => {
      !this.props.usersOnline[user] ? offline.push(user) : online.push(user);
    });
    //this.setState({ offline, online });
    return { offline, online };
  }

  render() {
    let { showUsers, didSelectUser } = this.props.userPane.userPaneData;
    if (didSelectUser === false) {
      let usersToLoad = showUsers ? this.state.users : this.state.friends;
      let { offline, online } = this.handleOnlineUsers(usersToLoad);
      return (
        <div>
          <Row className="userpane-status">Online - {online.length}</Row>
          {online.map((user, key) => {
            return (
              <Row
                key={key}
                onClick={() => this.handleSelectedUser(user)}
                className="userpane-row-online"
              >
                <Image
                  className="logo"
                  src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/updated-favicon.png"
                  rounded
                />{" "}
                {user}
              </Row>
            );
          })}
          <Row className="userpane-status">Offline - {offline.length}</Row>
          {offline.map((user, key) => {
            return (
              <Row
                key={key}
                onClick={() => this.handleSelectedUser(user)}
                className="userpane-row"
              >
                <Image
                  className="logo"
                  src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/updated-favicon.png"
                  rounded
                />{" "}
                {user}
              </Row>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          <SideProfile
            users={this.state.users}
            friends={this.state.friends}
            pendingFriends={this.state.pendingFriends}
            fetchFriends={this.fetchAllFriends.bind(this)}
            notificationsSocket={this.props.notificationsSocket}
          />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    local: state.local.localData,
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(UserPane);
