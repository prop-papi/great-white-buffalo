import React, { Component } from "react";
import { Grid, Col, Row, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setUserPaneData } from "../../actions";
import "../MainNavBar/MainNavBar.css";

class UsersNav extends Component {
  constructor() {
    super();
    this.state = {
      userPane: {}
    };
  }

  componentDidMount() {
    this.state.userPane = Object.assign({}, this.props.userPane);
  }
  handleButton(e) {
    e.target.value;
  }

  render() {
    return (
      <div>
        <Row className="nav-row">
          <Col align="center" md={6}>
            <Button onClick={e => this.handleButton(e)} value="Users">
              Users
            </Button>
          </Col>
          <Col align="center" md={6}>
            <Button onClick={e => this.handleButton(e)} value="Friends">
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
