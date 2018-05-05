import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { testAction } from '../../actions'

class CreateBet extends React.Component { // note we do not export the actual React component
  constructor(props) {
    super(props)
    this.state = {
      createValue: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ createValue: e.target.value });
  }

  handleSubmit(e) {
    this.props.testAction(this.state.createValue)
    event.preventDefault();
  }


  render() {
    return (
      <div>Hello from React router create bet
            your current store is as follows!!!
            {/* {this.props.store.getState()} */}

            and this.props.createNumber is '{JSON.stringify(this.props.createNumber)}'
            and this.props.searchNumber is '{JSON.stringify(this.props.searchNumber)}'
            <button onClick={()=> console.log(this.props.createNumber)}/>
      <div>
        <input type="text" value={this.state.createValue} onChange={this.handleChange} />
        <input type="submit" value="Submit" onClick={this.handleSubmit}/>
      </div>
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