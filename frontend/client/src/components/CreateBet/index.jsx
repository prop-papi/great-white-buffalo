import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { testAction } from '../../actions'
import DatePicker from 'react-16-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';
import moment from 'moment';
import {
  ButtonToolbar,
  DropdownButton,
  FormControl,
  Input,
  Button,
  Form,
  MenuItem,
  Col,
  ControlLabel,
  Alert
} from "react-bootstrap";

class CreateBet extends React.Component {
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
      clubs: {},
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.expDateChange = this.expDateChange.bind(this);
    this.expTimeChange = this.expTimeChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
    this.endTimeChange = this.endTimeChange.bind(this);
    this.createSelectItems = this.createSelectItems.bind(this);
    this.selectClub = this.selectClub.bind(this);
  }

  componentDidMount() {
    this.setState({
      clubs: this.createSelectItems(),
      club: this.props.data.localData.club[0].id,
    });
  }

  createSelectItems() {
    let items = {};
    this.props.data.globalData.clubs.forEach((club) => {
      items[club.id] = club.name
    });
    return items;
  }

  selectClub(e) {
    console.log(e)
    this.setState({ 'club': e });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const expiresAt = new Date((new Date(this.state.expiresDate).getTime()) + (this.state.expiresTime * 1000) - 43200000).toISOString();
    const endsAt = new Date((new Date(this.state.endDate).getTime()) + (this.state.endTime * 1000) - 43200000).toISOString();
    //const { club}
    // const body = {
    //   end
    // };
    // console.log('exp' , expiresAt, 'end ', endsAt)
    // write to database and then call action i create here!!!!
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
        <ButtonToolbar>
          <DropdownButton title="Clubs" id={1}>
            {Object.keys(this.state.clubs).map(c => <MenuItem onSelect={this.selectClub} key={c} eventKey={c}>{this.state.clubs[c]}</MenuItem>)}     
          </DropdownButton>     
        </ButtonToolbar>
        {this.state.clubs[this.state.club]}
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

function mapStateToProps(state) { // specifies the slice of state this compnent wants and provides it
  return {
    data: state.data
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