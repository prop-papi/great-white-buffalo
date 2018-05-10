import React, { Component } from "react";
import { Row } from "react-bootstrap";
import { connect } from "react-redux";
import { setUserPaneData } from "../../actions";
import SideProfile from "./SideProfile";
import axios from "axios";

class UserPane extends Component {
  constructor() {
    super();
    this.state = {
      users: ["D2", "buffalojuan", "warreng", "indabuff"],
      friends: [],
      selectedUser: {}
    };
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

const mapStateToProps = state => {
  return {
    userPane: state.userPane
  };
};

const mapDispatchToProps = dispatch => ({
  setUserPaneData: userPaneData => {
    dispatch(setUserPaneData(userPaneData, dispatch));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPane);
