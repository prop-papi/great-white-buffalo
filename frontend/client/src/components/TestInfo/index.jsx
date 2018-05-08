import React from 'react';
import { connect } from 'react-redux';
import { setTestData } from '../../actions';
import axios from 'axios';


class TestData extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Redux current store local data - called with 'this.props.data.localData'
        <br /> <br />
        {JSON.stringify(this.props.data.localData)}

        <br /><br /><br /><br />

        Redux current store global data - called with 'this.props.data.globalData'
        <br /> <br />
        {JSON.stringify(this.props.data.globalData)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
  };
}

export default connect(mapStateToProps)(TestData);