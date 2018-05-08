import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { testAction } from '../../actions'
import DatePicker from 'react-16-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';

class CreateBet extends React.Component { // note we do not export the actual React component
  constructor(props) {
    super(props)
    this.state = {
      endDate: new Date(moment().startOf('day').add(12, 'hours')).toISOString(), // starts at noon today bc of way date picker works
      endTime: (new Date(this.round(moment(), moment.duration(30, 'minutes'), 'ceil')).getTime() - (new Date(moment().startOf('day')).getTime())) / 1000, // defaults to next 30 min time
      expiresDate: new Date(moment().startOf('day').add(12, 'hours')).toISOString(), // starts at noon today bc of way date picker works
      expiresTime: (new Date(this.round(moment(), moment.duration(30, 'minutes'), 'ceil')).getTime() - (new Date(moment().startOf('day')).getTime())) / 1000, // defaults to next 30 min time
      club: '', // should be a drop down and default to currently selected club
      wager: '', // text field input
      description: '', // text field input
      odds: '1:1', // be able to change ultimately
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.expDateChange = this.expDateChange.bind(this);
    this.expTimeChange = this.expTimeChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
    this.endTimeChange = this.endTimeChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    var expiresAt = new Date((new Date(this.state.expiresDate).getTime()) + (this.state.expiresTime * 1000) - 43200000).toISOString();
    var endsAt = new Date((new Date(this.state.endDate).getTime()) + (this.state.endTime * 1000) - 43200000).toISOString();
    console.log('exp' , expiresAt, 'end ', endsAt)
    event.preventDefault();
  }

  round(date, duration, method) {
    return moment(Math[method]((+date) / (+duration)) * (+duration)); 
  }

  expDateChange(value) {
    this.setState({ "expiresDate": value });
  }

  expTimeChange(time) {
    this.setState({ "expiresTime": time });
  }

  endDateChange(value) {
    this.setState({ "endDate": value });
  }

  endTimeChange(time) {
    this.setState({ "endTime": time });
  }

  render() {
    return (
      <div>
        Description <input type="text" name="description" value={this.state.description} onChange={this.handleChange} />
        Wager Amount <input type="text" name="wager" value={this.state.wager} onChange={this.handleChange} />
        <div className="datePicker">
          Expires <DatePicker name="expiresDate" value={this.state.expiresDate} onChange={this.expDateChange} />
        </div>
        <div className="timePicker">
          <TimePicker onChange={this.expTimeChange} value={this.state.expiresTime}/>
        </div>
        <div className="datePicker">
          End <DatePicker name="endDate" value={this.state.endDate} onChange={this.endDateChange} />
        </div>
        <div className="timePicker">
          <TimePicker onChange={this.endTimeChange} value={this.state.endTime}/>
        </div>
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
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