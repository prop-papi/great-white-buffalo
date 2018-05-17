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
        {console.log("this.props.main: ", this.props.main)}
        Redux current main component - called with this.props.component
        <br />
        <br />
        {JSON.stringify(this.props.main)}
        <br />
        <br />
        {JSON.stringify(this.props)}
        <br />
        <br />
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
    local: state.local,
    main: state.component
  };
}

export default connect(mapStateToProps)(TestData);
