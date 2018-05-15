import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateBalances } from "../../actions";
import DatePicker from "react-16-bootstrap-date-picker";
import TimePicker from "react-bootstrap-time-picker";
import moment from "moment";
import "./index.css";
import {
  ButtonToolbar,
  DropdownButton,
  FormControl,
  OverlayTrigger,
  Input,
  Tooltip,
  Button,
  Form,
  MenuItem,
  Col,
  ControlLabel,
  Alert
} from "react-bootstrap";

// add confirmation dialogue w/ bet details!!!

class CreateBet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: new Date(
        moment()
          .startOf("day")
          .add(12, "hours")
      ).toISOString(), // starts at noon today bc of way date picker works
      endTime:
        (new Date(
          this.round(moment(), moment.duration(30, "minutes"), "ceil")
        ).getTime() -
          new Date(moment().startOf("day")).getTime()) /
        1000, // defaults to next 30 min time
      expiresDate: new Date(
        moment()
          .startOf("day")
          .add(12, "hours")
      ).toISOString(), // starts at noon today bc of way date picker works
      expiresTime:
        (new Date(
          this.round(moment(), moment.duration(30, "minutes"), "ceil")
        ).getTime() -
          new Date(moment().startOf("day")).getTime()) /
        1000, // defaults to next 30 min time
      club: "",
      wager: "", // needs to compare against user tokens and write change to database
      description: "",
      odds: "1:1", // be able to change ultimately
      clubs: {},
      showBetFailAlert: false,
      showBetSuccessAlert: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.expDateChange = this.expDateChange.bind(this);
    this.expTimeChange = this.expTimeChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
    this.endTimeChange = this.endTimeChange.bind(this);
    this.createSelectItems = this.createSelectItems.bind(this);
    this.selectClub = this.selectClub.bind(this);
    this.handleDismissCreateError = this.handleDismissCreateError.bind(this);
    this.handleDismissCreateSuccess = this.handleDismissCreateSuccess.bind(
      this
    );

    this.tooltips = [
      <Tooltip id="tooltip">
        Be as descriptive as possible as this description will need to be
        understood and read by others to both accept and vote on the outcome of
        this wager!!!
      </Tooltip>,
      <Tooltip id="tooltip">
        Please enter a whole number between 1 and your available balance (shown
        to the right)
      </Tooltip>,
      <Tooltip id="tooltip">
        This is the last time someone should be able to accept your wager i.e.
        the beginning of a game or season depending on the wager (must be before
        'Ends At')
      </Tooltip>,
      <Tooltip id="tooltip">
        This is the time you expect the outcome of the wager to be decided by
        i.e. after the game or season (must be after 'Expires At')
      </Tooltip>,
      <Tooltip id="tooltip">
        Current balance available to wager (not tied up in current or pending
        wagers)
      </Tooltip>,
      <Tooltip id="tooltip">
        Currently all wagers are set to 1:1 odds. The ability to change this
        will be added in an upcoming release!
      </Tooltip>
    ];

    this.alertStyle = {
      width: "150%"
    };
  }

  componentDidMount() {
    this.setState({
      clubs: this.createSelectItems(),
      club: this.props.local.localData.club.id
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      club: newProps.local.localData.club.id
    });
  }

  createSelectItems() {
    let items = {};
    this.props.global.globalData.clubs.forEach(club => {
      items[club.id] = club.name;
    });
    return items;
  }

  selectClub(e) {
    this.setState({ club: e });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const currently = new Date().toISOString();
    const expiresAt = new Date(
      new Date(this.state.expiresDate).getTime() +
        this.state.expiresTime * 1000 -
        43200000
    ).toISOString();
    const formattedExpiresAt = moment
      .utc(expiresAt)
      .format("YYYY-MM-DD HH:mm:ss");
    const endsAt = new Date(
      new Date(this.state.endDate).getTime() +
        this.state.endTime * 1000 -
        43200000
    ).toISOString();
    const formattedEndsAt = moment.utc(endsAt).format("YYYY-MM-DD HH:mm:ss");
    const { club, wager, odds, description } = this.state;
    if (
      new Date(expiresAt) >= new Date(currently) &&
      new Date(endsAt) >= new Date(expiresAt) &&
      wager !== "" &&
      description !== "" &&
      Number(wager) >= 1
    ) {
      const body = {
        club,
        wager,
        odds,
        description,
        formattedExpiresAt,
        formattedEndsAt,
        user: localStorage.id
      };
      try {
        const data = await axios.post(
          `http://localhost:1337/api/bets/create`,
          body
        );
        if (data.status === 200) {
          this.setState({
            endDate: new Date(
              moment()
                .startOf("day")
                .add(12, "hours")
            ).toISOString(), // starts at noon today bc of way date picker works
            endTime:
              (new Date(
                this.round(moment(), moment.duration(30, "minutes"), "ceil")
              ).getTime() -
                new Date(moment().startOf("day")).getTime()) /
              1000, // defaults to next 30 min time
            expiresDate: new Date(
              moment()
                .startOf("day")
                .add(12, "hours")
            ).toISOString(), // starts at noon today bc of way date picker works
            expiresTime:
              (new Date(
                this.round(moment(), moment.duration(30, "minutes"), "ceil")
              ).getTime() -
                new Date(moment().startOf("day")).getTime()) /
              1000, // defaults to next 30 min time
            wager: "", // needs to compare against user tokens and write change to database
            description: "",
            showBetSuccessAlert: true
          });
          this.props.updateBalances(
            this.props.global.globalData,
            Number(wager),
            true
          );
          // add bet to bets array in redux?
        }
      } catch (err) {
        this.setState({ showBetFailAlert: true });
        throw new Error(err);
      }
    } else {
      this.setState({ showBetFailAlert: true });
    }
  }

  round(date, duration, method) {
    return moment(Math[method](+date / +duration) * +duration);
  }

  expDateChange(value) {
    this.setState({ expiresDate: value });
  }

  expTimeChange(time) {
    this.setState({ expiresTime: time });
  }

  endDateChange(value) {
    this.setState({ endDate: value });
  }

  endTimeChange(time) {
    this.setState({ endTime: time });
  }

  handleDismissCreateError() {
    this.setState({
      showBetFailAlert: false
    });
  }

  handleDismissCreateSuccess() {
    this.setState({
      showBetSuccessAlert: false
    });
  }

  render() {
    return (
      <div className="row" id="createBetComponent">
        <div className="col-md-2" />
        <div className="col-md-8">
          <OverlayTrigger placement="right" overlay={this.tooltips[0]}>
            <span>Description</span>
          </OverlayTrigger>
          <FormControl
            componentClass="textarea"
            type="text"
            name="description"
            rows="4"
            value={this.state.description}
            onChange={this.handleChange}
          />
          <br />
          <div className="col-md-6">
            <OverlayTrigger placement="right" overlay={this.tooltips[1]}>
              <span>Wager Amount </span>
            </OverlayTrigger>
            <input
              type="text"
              name="wager"
              style={{ width: 100 }}
              value={this.state.wager}
              onChange={this.handleChange}
            />
            <br /> <br />
            <OverlayTrigger placement="right" overlay={this.tooltips[5]}>
              <span>Wager Odds</span>
            </OverlayTrigger>{" "}
            {this.state.odds}
            <br /> <br />
            <div className="datePicker">
              <OverlayTrigger placement="right" overlay={this.tooltips[2]}>
                <span>Expires At</span>
              </OverlayTrigger>
              <DatePicker
                name="expiresDate"
                value={this.state.expiresDate}
                onChange={this.expDateChange}
              />
            </div>
            <div className="timePicker">
              <TimePicker
                onChange={this.expTimeChange}
                value={this.state.expiresTime}
              />
            </div>
            <br />
            <input
              type="submit"
              style={{ position: "absolute", left: "7%" }}
              className="submitButton"
              onClick={this.handleSubmit}
            />
          </div>
          <div className="col-md-6">
            <OverlayTrigger placement="right" overlay={this.tooltips[4]}>
              <span>My Available Balance: </span>
            </OverlayTrigger>
            {this.props.global.globalData.balances[0].available_balance}
            <br /> <br />
            <span>
              {this.state.clubs[this.state.club]}{" "}
              <ButtonToolbar className="testing">
                <DropdownButton title="Clubs" id={1}>
                  {Object.keys(this.state.clubs).map(c => (
                    <MenuItem
                      className="menu"
                      onSelect={this.selectClub}
                      key={c}
                      eventKey={c}
                    >
                      {this.state.clubs[c]}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </ButtonToolbar>
            </span>
            <div className="datePicker">
              <br />
              <OverlayTrigger placement="right" overlay={this.tooltips[3]}>
                <span>Ends At</span>
              </OverlayTrigger>
              <br />
              <DatePicker
                name="endDate"
                value={this.state.endDate}
                onChange={this.endDateChange}
              />
            </div>
            <div className="timePicker">
              <TimePicker
                onChange={this.endTimeChange}
                value={this.state.endTime}
              />
            </div>
            <br />
            {this.state.showBetFailAlert ? (
              <Alert
                bsStyle="danger"
                style={this.alertStyle}
                onDismiss={this.handleDismissCreateError}
              >
                <h4>Oh snap! You got an error!</h4>
                <p>
                  There is an error in your wager input. Please verify and try
                  again.
                </p>
                <p>
                  <Button onClick={this.handleDismissCreateError}>Close</Button>
                </p>
              </Alert>
            ) : null}
            {this.state.showBetSuccessAlert ? (
              <Alert
                bsStyle="success"
                style={this.alertStyle}
                onDismiss={this.handleDismissCreateError}
              >
                <h4>Wager created successfully!!!</h4>
                <p>
                  Congratulations, your wager has been successfully created. You
                  can view all of your wagers from your profile.
                </p>
                <p>
                  <Button onClick={this.handleDismissCreateSuccess}>
                    Close
                  </Button>
                </p>
              </Alert>
            ) : null}
          </div>
          <br />
        </div>
        <div className="col-md-2" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    global: state.global,
    local: state.local
  };
}

function bindActionsToDispatch(dispatch) {
  // this.props.global.globalData.balances[0].available_balance and escrow_balance
  return bindActionCreators(
    {
      updateBalances: updateBalances
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(CreateBet); // exporting something similar to our CreateBet class, but
// that has access to what we defined in mapStateToProps and bindActionsToDispatch
