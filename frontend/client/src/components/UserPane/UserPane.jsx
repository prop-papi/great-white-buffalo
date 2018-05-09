import React, { Component } from "react";
import { Row } from "react-bootstrap";
import SideProfile from "./SideProfile";
import axios from "axios";

class UserPane extends Component {
  constructor() {
    super();
    this.state = {
      users: ["D2", "buffalojohn", "warreng", "indabuff"],
      friends: [],
      showUsers: true,
      didSelectUser: false,
      selectedUser: {}
    };
    this.handleSelectedUser = this.handleSelectedUser.bind(this);
  }

  componentDidMount() {
    // Change this later be whoever was clicked on
  }

  handleSelectedUser(username) {
    let params = {
      username
    };
    axios
      .get("http://localhost:1337/api/users/selected", { params })
      .then(response => {
        this.setState({ selectedUser: response.data[0], didSelectUser: true });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  render() {
    if (this.state.didSelectUser === false) {
      let usersToLoad = this.state.showUsers
        ? this.state.users
        : this.state.friends;
      console.log(usersToLoad);
      return (
        <div>
          {usersToLoad.map((user, key) => {
            return (
              <Row key={key} onClick={() => this.handleSelectedUser(user)}>
                {user}
              </Row>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          <SideProfile selectedUser={this.state.selectedUser} />
        </div>
      );
    }
  }
}

export default UserPane;
