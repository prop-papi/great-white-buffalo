import React, { Component } from "react";
import { Row } from "react-bootstrap";
import { connect } from "react-redux";
import { setUserPaneData } from "../../actions/index";
import SideProfile from "./SideProfile";
import axios from "axios";

class UserPane extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      friends: [],
      selectedUser: {}
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
      clubID: id
    };
    axios
      .get("http://localhost:1337/api/userpane/allUsers", { params })
      .then(response => {
        this.setState({
          users: response.data
        });
      })
      .catch(err => {
        console.log("Error fetch all users", err);
      });
  }

  fetchAllFriends(id) {
    const params = {
      id
    };
    axios
      .get("http://localhost:1337/api/userpane/friends", { params })
      .then(response => {
        console.log("afa", response.data);
        this.setState({
          friends: response.data
        });
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
      .get("http://localhost:1337/api/userpane/selected", { params })
      .then(response => {
        this.setState({ selectedUser: response.data[0] });
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        this.props.setUserPaneData(newUserPane);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  render() {
    let { showUsers, didSelectUser } = this.props.userPane.userPaneData;
    if (didSelectUser === false) {
      let usersToLoad = showUsers ? this.state.users : this.state.friends;
      return (
        <div>
          {usersToLoad.map((user, key) => {
            return (
              <Row
                key={key}
                onClick={() => this.handleSelectedUser(user.username)}
              >
                {user.username}
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

const mapStateToProps = state => {
  return {
    local: state.local.localData,
    userPane: state.userPane
  };
};

const mapDispatchToProps = dispatch => ({
  setUserPaneData: userPaneData => {
    dispatch(setUserPaneData(userPaneData, dispatch));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPane);
