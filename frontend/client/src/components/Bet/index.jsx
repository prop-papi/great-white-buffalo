import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
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
  ControlLabel,
  Alert
} from "react-bootstrap";

class Bet extends React.Component {
  // note we do not export the actual React component
  constructor(props) {
    super(props);

    this.state = {
      showCancelBetError: false,
      showAcceptBetError: false
    };

    this.cancelBet = this.cancelBet.bind(this);
    this.acceptBet = this.acceptBet.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.handleCancelBetError = this.handleCancelBetError.bind(this);
    this.handleAcceptBetError = this.handleAcceptBetError.bind(this);

    this.tooltips = [
      // will i need this?
      <Tooltip id="tooltip">IF I NEED A TOOLTIP IN HERE</Tooltip>
    ];
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {}

  onConfirm() {
    if (this.props.bet.is_my_bet) {
      this.cancelBet();
    } else {
      this.acceptBet();
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
    // what if someone canceled before i re-render?
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
        <div className="row">
          <div className="col-md-10" id="betInfo">
            {this.props.bet.description}
            {"  "}
            {this.props.bet.odds}
            {" odds  "}
            {this.props.bet.wager} token(s)
          </div>
          <div className="col-md-2">
            {this.props.bet.challenger !== null ? null : (
              <Confirm
                onConfirm={this.onConfirm}
                value={this.props.bet.is_my_bet ? 1 : 0}
                body={
                  this.props.bet.is_my_bet
                    ? "Are you sure you want to cancel this wager?"
                    : "Are you sure you want to accept this wager?"
                }
                confirmText="Confirm"
                title={this.props.bet.is_my_bet ? "Cancel Wager" : "Take Wager"}
              >
                <button>
                  {this.props.bet.is_my_bet ? "Cancel Wager" : "Take Wager"}
                </button>
              </Confirm>
            )}
          </div>
        </div>
        {this.state.showCancelBetError ? (
          <Alert
            bsStyle="danger"
            style={this.alertStyle}
            onDismiss={this.handleCancelBetError}
          >
            <h4>Someone has already accepted this bet!</h4>
            <p>
              Sorry, you were too late! This bet will be displayed in active
              wagers upon refresh.
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
              Sorry, this bet was either canceled or accepted by another user.
            </p>
            <p>
              <Button onClick={this.handleAcceptBetError}>Close</Button>
            </p>
          </Alert>
        ) : null}
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
