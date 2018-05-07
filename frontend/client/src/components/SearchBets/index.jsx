import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { testSearchAction } from '../../actions'

class CreateBet extends React.Component { // note we do not export the actual React component
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  handleSubmit(e) {
    this.props.testSearchAction(this.state.searchValue)
    event.preventDefault();
  }


  render() {
    return (
      <div>Hello from React router search bet
            your global data in the store is 
            {this.props.global}
            and your local data in the store is
            {this.props.local}
      <div>
        <input type="text" value={this.state.searchValue} onChange={this.handleChange} />
        <input type="submit" value="Submit" onClick={this.handleSubmit}/>
      </div>
      </div>
    );
  }
}

function mapStateToProps(state) { // specifies the slice of state this compnent wants and provides it
  return {
    searchNumber: state.searchNumber,
    local: state.localData,
    global: state.globalData,
  };
}

function bindActionsToDispatch(dispatch) { 
  return bindActionCreators(
    {
      testSearchAction: testSearchAction
    },
    dispatch
  );
}


export default connect(mapStateToProps, bindActionsToDispatch)(CreateBet);