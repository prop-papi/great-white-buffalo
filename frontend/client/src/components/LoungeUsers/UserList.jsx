import React, { Component } from "react";
import axios from "axios";
import User from "./User";

class UserList extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:1337/api/loungeUsers/users")
      .then(response => {
        console.log("here is response", response);
        this.setState({ users: response.data });
      })
      .catch(err => {
        console.log("error,", err);
      });
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.users.map((user, key) => {
            return <li key={key}>{user.username}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default UserList;
