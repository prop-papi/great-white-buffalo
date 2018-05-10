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

    this.cancelBet = this.cancelBet.bind(this);
    this.acceptBet = this.acceptBet.bind(this);
    this.onConfirm = this.onConfirm.bind(this);

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

  async cancelBet() {
    try {
      const data = await axios.post(`http://localhost:1337/api/bets/cancel`, {
        betId: this.props.bet.id
      });
      if (data.status === 200) {
        this.props.cancelMyBet(
          this.props.global.globalData,
          this.props.bet.id,
          this.props.bet.wager
        );
      }
    } catch (err) {
      //this.setState({ showBetFailAlert: true });
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
        this.props.acceptBet(
          this.props.global.globalData,
          this.props.bet.id,
          this.props.bet.wager,
          localStorage.id
        );
      }
    } catch (err) {
      //this.setState({ showBetFailAlert: true });
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
