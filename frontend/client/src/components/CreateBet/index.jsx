import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { testAction } from '../../actions'

class CreateBet extends React.Component { // note we do not export the actual React component
  constructor(props) {
    super(props)
    this.state = {
      end: '', // this should be calendar
      club: '', // should be a drop down and default to currently selected club
      wager: '', // text field input
      description: '', // text field input
      odds: '1:1', // be able to change ultimately
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    this.props.testAction(this.state.value) // this will be submitting a bet
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <input type="text" name="club" value={this.state.value} onChange={this.handleChange} />
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Submit" onClick={this.handleSubmit}/>
      </div>
    );
  }
}

function mapStateToProps(state) { // specifies the slice of state this compnent wants and provides it
  return {
    createNumber: state.createNumber,
    searchNumber: state.searchNumber
  };
}

function bindActionsToDispatch(dispatch) { 
  return bindActionCreators(
    {
      testAction: testAction
    },
    dispatch
  );
}


export default connect(mapStateToProps, bindActionsToDispatch)(CreateBet); // exporting something similar to our CreateBet class, but
                                                    // that has access to what we defined in mapStateToProps and bindActionsToDispatch