import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormControl, Grid, Row, Col } from "react-bootstrap";

// custom css (if needed)
// import "./Leaderboard.css"

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <div>hello</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    global: state.global,
    local: state.local
  };
};

const bindActionsToDispatch = dispatch => {
  return bindActionCreators(
    {
      // setTestDat: setTestData
    },
    dispatch
  );
};

export default connect(mapStateToProps, bindActionsToDispatch)(Leaderboard);
