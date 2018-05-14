import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import moment from "moment";
import Confirm from "react-confirm-bootstrap";
import {
  cancelMyBet,
  acceptBet,
  voteOnBet,
  updateUserPaneData
} from "../../actions";

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
  // *******Need to get reputation of both parties to display on bet, and in the future filter who can bet on my items based on their repuation*****
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
      myVoteResult: props.bet.is_my_bet
        ? Number(localStorage.id) === props.bet.creator
          ? props.bet.creator_vote
          : props.bet.challenger_vote
        : "N/A",
      timeZoneOffset: new Date().getTimezoneOffset()
    };

    this.cancelBet = this.cancelBet.bind(this);
    this.acceptBet = this.acceptBet.bind(this);
    this.handleCancelBetError = this.handleCancelBetError.bind(this);
    this.handleAcceptBetError = this.handleAcceptBetError.bind(this);
    this.displaySideProfile = this.displaySideProfile.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      myVoteResult: newProps.bet.is_my_bet
        ? Number(localStorage.id) === newProps.bet.creator
          ? newProps.bet.creator_vote
          : newProps.bet.challenger_vote
        : "N/A"
    });
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

  displaySideProfile(target) {
    let params = {
      username: target.currentTarget.innerHTML
    };
    axios
      .get("http://localhost:1337/api/userpane/selected", { params })
      .then(response => {
        //this.setState({ selectedUser: response.data[0] });
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        newUserPane.selectedUser = response.data[0];
        this.props.updateUserPaneData(newUserPane);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  async vote(v) {
    try {
      const data = await axios.post(`http://localhost:1337/api/bets/vote`, {
        bet: this.props.bet,
        myId: Number(localStorage.id),
        vote: v
      });
      // redux stuff here!
      if (data.status === 200) {
        if (data.data.changedRows) {
          // only updating if I say I lost, as at vote win nothing is determined. Update KDR???
          this.props.voteOnBet(
            this.props.global.globalData,
            this.props.bet.id,
            this.props.bet.wager,
            v,
            this.state.myVote
          );
        } else {
          this.setState({ showCancelBetError: true });
        }
      }
    } catch (err) {
      throw new Error(err);
    }
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
          this.setState({ myVote: "challenger" });
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
                <div className="col-md-3" id="betInfo">
                  {this.props.bet.wager} token(s)
                </div>
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
                  <span
                    className="opponent-name"
                    onClick={this.displaySideProfile}
                  >
                    {this.state.myVote === "creator"
                      ? this.props.bet.challenger_name
                      : this.props.bet.creator_name}
                  </span>
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
                  {this.props.bet.status === "pending" &&
                  this.state.myVote === "creator" ? (
                    <Confirm
                      onConfirm={this.cancelBet}
                      value={1}
                      body="Are you sure you want to cancel this wager?"
                      confirmText="Confirm"
                      title="Cancel Wager"
                    >
                      <button>Cancel Wager</button>
                    </Confirm>
                  ) : null}
                  {this.props.bet.status === "active"
                    ? "Active Bet! anything I want to see in here? Don't Show expiration date for active bets! Just end date! Make the description field clearer who is on what side"
                    : null}
                  {this.props.bet.status === "voting" &&
                  this.state.myVoteResult === null ? (
                    <div>
                      <Confirm
                        onConfirm={() => this.vote(1)}
                        value={1}
                        body="Are you sure you won this wager? If you did not it will hurt your reputation and people may not wager with you. &quot;A single lie destroys a whole reputation of integrity.&quot; - Baltasar Gracian"
                        confirmText="Confirm"
                        title="Won Wager"
                      >
                        <button>I won</button>
                      </Confirm>
                      <br /> <br />
                      <Confirm
                        onConfirm={() => this.vote(0)}
                        value={1}
                        body="By clicking confirm you are confirming that you lost the wager and this wager will immediately be marked as a loss for you and a win for your opponent. Your reputation will not only remain intact, but improve. &quot;Integrity is the essence of everything successful.&quot; - R. Buckminster Fuller"
                        confirmText="Confirm"
                        title="Lost Wager"
                      >
                        <button>I lost</button>
                      </Confirm>
                    </div>
                  ) : this.props.bet.status === "voting" &&
                  this.state.myVoteResult !== null ? (
                    "I voted that I won this wager, waiting on my opponent"
                  ) : null}
                  {this.props.bet.status === "disputed" ? (
                    <div>
                      This bet is in dispute!!! Should there just be a button
                      here to send to a vote???
                    </div>
                  ) : null}
                  {this.props.bet.status === "canceled"
                    ? "You canceled this wager"
                    : null}
                  {this.props.bet.status === "expired"
                    ? "This wager expired with no takers"
                    : null}
                  {this.props.bet.status === "resolved"
                    ? "Put bet result here!!!"
                    : null}
                  {this.props.bet.status === "pending" &&
                  this.state.myVote === "N/A" ? (
                    <Confirm
                      onConfirm={this.acceptBet}
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
    local: state.local,
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      cancelMyBet: cancelMyBet,
      acceptBet: acceptBet,
      voteOnBet: voteOnBet,
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Bet);
