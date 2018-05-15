import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateBalances } from "../../actions";
import Bet from "../Bet/index.jsx";
import CreateBet from "../CreateBet/index";
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
  Tabs,
  Tab,
  MenuItem,
  Panel,
  PanelGroup,
  Col,
  ControlLabel,
  Alert
} from "react-bootstrap";

class SearchBets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      myOpenBets: [],
      myCurrentBets: [],
      myReviewBets: [],
      myHistoricalBets: [],
      myCanceledBets: [],
      myExpiredBets: [],
      myResolvedBets: [],
      openBets: [],
      openBetsName:
        props.local.localData.club.name === "Global"
          ? "Open Wagers Globally"
          : `Open Bets in ${props.local.localData.club.name}`
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.tooltips = [
      // will i need this?
      <Tooltip id="tooltip">IF I NEED A TOOLTIP IN HERE</Tooltip>
    ];
  }

  componentDidMount() {
    let tempMyOpen = [];
    let tempMyCurrent = [];
    let tempMyReview = [];
    let tempMyHistorical = [];
    let tempMyCanceled = [];
    let tempMyExpired = [];
    let tempMyResolved = [];
    let tempOpen = [];
    this.props.global.globalData.bets.forEach(b => {
      if (b.is_my_bet) {
        if (b.status === "pending") {
          tempMyOpen.push(b);
        } else if (b.status === "active") {
          tempMyCurrent.push(b);
        } else if (b.status === "voting" || b.status === "disputed") {
          tempMyReview.push(b);
        } else if (b.status === "canceled") {
          tempMyCanceled.push(b);
          tempMyHistorical.push(b);
        } else if (b.status === "expired") {
          tempMyExpired.push(b);
          tempMyHistorical.push(b);
        } else if (b.status === "resolved") {
          tempMyResolved.push(b);
          tempMyHistorical.push(b);
        }
      } else if (
        b.status === "pending" &&
        (this.props.local.localData.club.name === "Global" ||
          this.props.local.localData.club.id === b.club)
      ) {
        tempOpen.push(b);
      }
    });
    this.setState({
      myOpenBets: tempMyOpen,
      myCurrentBets: tempMyCurrent,
      myReviewBets: tempMyReview,
      myHistoricalBets: tempMyHistorical,
      myCanceledBets: tempMyCanceled,
      myExpiredBets: tempMyExpired,
      myResolvedBets: tempMyResolved,
      openBets: tempOpen,
      openBetsName:
        this.props.local.localData.club.name === "Global"
          ? "Open Wagers Globally"
          : `Open Bets in ${this.props.local.localData.club.name}`
    });
  }

  componentWillReceiveProps(newProps) {
    var tempMyOpen = [];
    var tempMyCurrent = [];
    var tempMyReview = [];
    var tempMyHistorical = [];
    var tempMyCanceled = [];
    var tempMyExpired = [];
    var tempMyResolved = [];
    var tempOpen = [];
    newProps.global.globalData.bets.forEach(b => {
      if (b.is_my_bet) {
        if (b.status === "pending") {
          tempMyOpen.push(b);
        } else if (b.status === "active") {
          tempMyCurrent.push(b);
        } else if (b.status === "voting" || b.status === "disputed") {
          tempMyReview.push(b);
        } else if (b.status === "canceled") {
          tempMyCanceled.push(b);
          tempMyHistorical.push(b);
        } else if (b.status === "expired") {
          tempMyExpired.push(b);
          tempMyHistorical.push(b);
        } else if (b.status === "resolved") {
          tempMyResolved.push(b);
          tempMyHistorical.push(b);
        }
      } else if (
        b.status === "pending" &&
        (newProps.local.localData.club.name === "Global" ||
          newProps.local.localData.club.id === b.club)
      ) {
        tempOpen.push(b);
      }
    });
    this.setState({
      myOpenBets: tempMyOpen,
      myCurrentBets: tempMyCurrent,
      myReviewBets: tempMyReview,
      myHistoricalBets: tempMyHistorical,
      myCanceledBets: tempMyCanceled,
      myExpiredBets: tempMyExpired,
      myResolvedBets: tempMyResolved,
      openBets: tempOpen,
      openBetsName:
        newProps.local.localData.club.name === "Global"
          ? "Open Wagers Globally"
          : `Open Bets in ${newProps.local.localData.club.name}`
    });
  }

  handleChange(e) {
    this.setState({ searchValue: e.target.value }); //  this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="searchBox">
        {/* <input
          type="text"
          placeholder="this currently does nothing"
          value={this.state.searchValue}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" onClick={this.handleSubmit} /> */}
        <div className="searchResults">
          <Tabs defaultActiveKey={5} id="betTabs">
            <Tab
              eventKey={1}
              title={"Open (" + this.state.myOpenBets.length + ")"}
            >
              {this.state.myOpenBets.map(b => <Bet key={b.id} bet={b} />)}
            </Tab>
            <Tab
              eventKey={2}
              title={"Active (" + this.state.myCurrentBets.length + ")"}
            >
              {this.state.myCurrentBets.map(b => <Bet key={b.id} bet={b} />)}
            </Tab>
            <Tab
              eventKey={3}
              title={"Review (" + this.state.myReviewBets.length + ")"}
            >
              {this.state.myReviewBets.map(b => <Bet key={b.id} bet={b} />)}
            </Tab>
            <Tab
              eventKey={4}
              title={"History (" + this.state.myHistoricalBets.length + ")"}
            >
              <h3>
                Make a clickable list here to change between canceled expired or
                resolved!!!
              </h3>
              {this.state.myHistoricalBets.map(b => <Bet key={b.id} bet={b} />)}
            </Tab>
            <Tab
              eventKey={5}
              title={
                this.state.openBetsName +
                " (" +
                this.state.openBets.length +
                ")"
              }
            >
              {this.state.openBets.map(b => <Bet key={b.id} bet={b} />)}
            </Tab>
            <Tab eventKey={6} title="Create Bet">
              <br />
              <CreateBet />
            </Tab>
          </Tabs>

          {/* My Open Wagers ({this.state.myOpenBets.length}) */}
          {/* {this.state.myOpenBets.map(b => <Bet key={b.id} bet={b} />)} */}
          {/* My Active Wagers ({this.state.myCurrentBets.length}) */}
          {/* {this.state.myCurrentBets.map(b => <Bet key={b.id} bet={b} />)} */}
          {/* Available {this.props.local.localData.club.name} Wagers ({ */}
          {/* this.state.openBets.length */}
          {/* {this.state.openBets.map(b => <Bet key={b.id} bet={b} />)} */}
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
      updateBalances: updateBalances
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(SearchBets);
