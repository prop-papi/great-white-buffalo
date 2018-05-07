import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTestData } from '../../actions';
import axios from 'axios';


class TestData extends React.Component { // note we do not export the actual React component
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    var l = require('../../data/local.json');
    var g = require('../../data/global.json');
    this.props.setTestData(l, g);
    event.preventDefault();
  }



  render() {
    return (
      <div>
        <input type="submit" value="Set Test Data!!!" onClick={this.handleSubmit}/>

       <button value="What is my local data??" onClick={()=> console.log(this.props.data.localData)}/>

        Local Test Data called with 'this.props.localData'
        {JSON.stringify(this.props.data.localData)}

        <br /><br /><br /><br />

        Global Test Data called with 'this.props.globalData'
        {JSON.stringify(this.props.data.globalData)}
      </div>
    );
  }
}

function mapStateToProps(state) { // specifies the slice of state this compnent wants and provides it
  return {
    //globalData: state.globalData,
    data: state.data,
  };
}

function bindActionsToDispatch(dispatch) { 
  return bindActionCreators(
    {
      setTestData: setTestData
    },
    dispatch
  );
}


export default connect(mapStateToProps, bindActionsToDispatch)(TestData); // exporting something similar to our CreateBet class, but
                                                    // that has access to what we defined in mapStateToProps and bindActionsToDispatch