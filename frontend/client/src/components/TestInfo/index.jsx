import React from "react";
import { connect } from "react-redux";
import { setTestData } from "../../actions";
import axios from "axios";

class TestData extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Redux current store local data - called with
        'this.props.local.localData'
        <br /> <br />
        {JSON.stringify(this.props.local.localData)}
        <br />
        <br />
        <br />
        <br />
        Redux current store global data - called with
        'this.props.global.globalData'
        <br /> <br />
        {JSON.stringify(this.props.global.globalData)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
    local: state.local
  };
}

export default connect(mapStateToProps)(TestData);
