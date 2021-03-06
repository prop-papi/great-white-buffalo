import React, { Component } from "react";
import { Grid, Col, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setUserPaneData } from "../../actions";
import "../MainNavBar/MainNavBar.css";

class UsersNav extends Component {
  constructor() {
    super();

    this.state = {
      activeTab: "users"
    };

    this.handleButton = this.handleButton.bind(this);
  }

  handleButton(e) {
    e.target.value === "Users"
      ? this.setState({ activeTab: "users" })
      : this.setState({ activeTab: "friends" });
    let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
    newUserPane.showUsers = e.target.value === "Users" ? true : false;
    newUserPane.didSelectUser = false;
    this.props.setUserPaneData(newUserPane);
  }

  render() {
    return (
      <div>
        <Row className="nav-row">
          <Col align="center" md={6}>
            <Button
              className={
                this.state.activeTab === "users"
                  ? "nav-button-userpane-active"
                  : "nav-button-userpane"
              }
              onClick={e => this.handleButton(e)}
              value="Users"
            >
              Users
            </Button>
          </Col>
          <Col align="center" md={6}>
            <Button
              className={
                this.state.activeTab === "friends"
                  ? "nav-button-userpane-active"
                  : "nav-button-userpane"
              }
              onClick={e => this.handleButton(e)}
              value="Friends"
            >
              Friends
            </Button>
          </Col>
        </Row>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersNav);
