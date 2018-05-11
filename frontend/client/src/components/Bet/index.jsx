import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import moment from "moment";
import Confirm from "react-confirm-bootstrap";
import { cancelMyBet, acceptBet } from "../../actions";
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
  Panel,
  ControlLabel,
  Alert
} from "react-bootstrap";

class Bet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCancelBetError: false,
      showAcceptBetError: false,
      myVote: props.bet.is_my_bet
        ? Number(localStorage.id) === props.bet.creator
          ? "creator"
          : "challenger"
        : "N/A",
      timeZoneOffset: new Date().getTimezoneOffset()
    };

    this.cancelBet = this.cancelBet.bind(this);
    this.acceptBet = this.acceptBet.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.handleCancelBetError = this.handleCancelBetError.bind(this);
    this.handleAcceptBetError = this.handleAcceptBetError.bind(this);
  }

  componentDidMount() {
    if (!this.props.status) {
      // figure out status of bets if this wasn't directly called from searchBets
    }
  }

  componentWillReceiveProps(newProps) {}

  onConfirm() {
    if (this.props.status === "open") {
      this.cancelBet();
    } else if (this.props.status === "notMine") {
      this.acceptBet();
    } else {
      alert("I need to handle for wager resolution!!!");
      // send to db marking this bet as won or lost and error handling in insert
    }
  }

  handleCancelBetError() {
    this.setState({
      showCancelBetError: false
    });
  }

  handleAcceptBetError() {
    this.setState({
      showAcceptBetError: false
    });
  }

  async cancelBet() {
    try {
      const data = await axios.post(`http://localhost:1337/api/bets/cancel`, {
        betId: this.props.bet.id
      });
      if (data.status === 200) {
        if (data.data.changedRows) {
          this.props.cancelMyBet(
            this.props.global.globalData,
            this.props.bet.id,
            this.props.bet.wager
          );
        } else {
          this.setState({ showCancelBetError: true });
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async acceptBet() {
    try {
      const data = await axios.post(`http://localhost:1337/api/bets/accept`, {
        betId: this.props.bet.id,
        myId: localStorage.id
      });
      if (data.status === 200) {
        if (data.data.changedRows) {
          this.props.acceptBet(
            this.props.global.globalData,
            this.props.bet.id,
            this.props.bet.wager,
            localStorage.id
          );
        } else {
          this.setState({ showAcceptBetError: true });
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  render() {
    return (
      <div
        className="wholeBet"
        id={this.props.bet.is_my_bet ? "myBet" : "othersBet"}
      >
        <Panel id="collapsible-panel">
          <Panel.Heading>
            <Panel.Title toggle>
              <div className="row">
                <div className="col-md-9" id="betInfo">
                  {this.props.bet.description}
                </div>
                <div className="col-md-3">{this.props.bet.wager} token(s)</div>
              </div>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <div className="row">
                {this.state.showCancelBetError ? (
                  <Alert
                    bsStyle="danger"
                    style={this.alertStyle}
                    onDismiss={this.handleCancelBetError}
                  >
                    <h4>Someone has already accepted this bet!</h4>
                    <p>
                      Sorry, you were too late! This bet will be displayed in
                      active wagers upon refresh.
                    </p>
                    <p>
                      <Button onClick={this.handleCancelBetError}>Close</Button>
                    </p>
                  </Alert>
                ) : null}
                {this.state.showAcceptBetError ? (
                  <Alert
                    bsStyle="danger"
                    style={this.alertStyle}
                    onDismiss={this.handleAcceptBetError}
                  >
                    <h4>Cannot accept this bet!</h4>
                    <p>
                      Sorry, this bet was either canceled or accepted by another
                      user.
                    </p>
                    <p>
                      <Button onClick={this.handleAcceptBetError}>Close</Button>
                    </p>
                  </Alert>
                ) : null}
                <div className="col-md-8" id="betInfo">
                  {"My "}
                  {this.state.myVote === "N/A" ? "potential " : ""}
                  {"opponent: "}
                  {this.state.myVote === "creator"
                    ? this.props.bet.challenger_name
                    : this.props.bet.creator_name}
                  <br />
                  {"Club: " + this.props.bet.club_name}
                  <br /> <br />
                  {"Odds: " + this.props.bet.odds} <br />
                  {"Bet expiration: " +
                    moment(new Date(this.props.bet.expires))
                      .subtract("minutes", this.state.timeZoneOffset)
                      .format("MMMM Do YYYY, h:mm a") +
                    " (" +
                    moment(new Date(this.props.bet.expires))
                      .subtract("minutes", this.state.timeZoneOffset)
                      .fromNow() +
                    ")"}
                  <br />
                  {"Bet end: " +
                    moment(new Date(this.props.bet.end_at))
                      .subtract("minutes", this.state.timeZoneOffset)
                      .format("MMMM Do YYYY, h:mm a") +
                    " (" +
                    moment(new Date(this.props.bet.end_at))
                      .subtract("minutes", this.state.timeZoneOffset)
                      .fromNow() +
                    ")"}
                </div>
                <div className="col-md-4" id="betActionInfo">
                  {this.props.bet.status}
                  {this.props.status === "open" ? (
                    <Confirm
                      onConfirm={this.onConfirm}
                      value={1}
                      body="Are you sure you want to cancel this wager?"
                      confirmText="Confirm"
                      title="Cancel Wager"
                    >
                      <button>Cancel Wager</button>
                    </Confirm>
                  ) : null}
                  {this.props.status === "active"
                    ? "Active Bet! anything I want to see in here? Don't Show expiration date for active bets! Just end date! Make the description field clearer who is on what side"
                    : null}
                  {this.props.status === "review" ? (
                    <div>
                      {/* ONLY RENDER THESE BUTTONS IF I HAVENT ALREADY VOTED ON IT */}
                      <Confirm
                        onConfirm={this.onConfirm}
                        value={1}
                        body="Are you sure you won this bet? If you did not it will hurt your reputation by saying you did"
                        confirmText="Confirm"
                        title="Won Wager"
                      >
                        <button>I won</button>
                      </Confirm>
                      <br /> <br />
                      <Confirm
                        onConfirm={this.onConfirm}
                        value={1}
                        body="I lost this bet."
                        confirmText="Confirm"
                        title="Lost Wager"
                      >
                        <button>I lost</button>
                      </Confirm>
                    </div>
                  ) : null}
                  {this.props.status === "history"
                    ? "Historical bet! Show result!"
                    : null}
                  {this.props.status === "notMine" ? (
                    <Confirm
                      onConfirm={this.onConfirm}
                      value={0}
                      body="Are you sure you want to accept this wager?"
                      confirmText="Confirm"
                      title="Take Wager"
                    >
                      <button>Take Wager</button>
                    </Confirm>
                  ) : null}
                </div>
              </div>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
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
  return bindActionCreators(
    {
      cancelMyBet: cancelMyBet,
      acceptBet: acceptBet
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Bet);
