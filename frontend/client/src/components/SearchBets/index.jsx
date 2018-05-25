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
      myAdminReview: [],
      myReviewBets: [],
      myHistoricalBets: [],
      myCanceledBets: [],
      myExpiredBets: [],
      myClosedBets: [],
      openBets: [],
      openBetsName:
        props.local.localData.club.name === "Global"
          ? "Open Wagers Globally"
          : `Open Bets in ${props.local.localData.club.name}`,
      historyTab: "Closed"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHistoryView = this.changeHistoryView.bind(this);

    this.tooltips = [
      <Tooltip id="tooltip">
        Please note you will be taking the opposite side of the wager's
        description. For example, with a description of 'The Cavaliers will beat
        the Celtics in Game 3 of the NBA Eastern Conference Finals on May 19,
        2018', the creator will be on the Cavalier's side and the challenger
        (you) on the side of the Celtics
      </Tooltip>
    ];
  }

  componentDidMount() {
    let tempMyOpen = [];
    let tempMyCurrent = [];
    let tempMyReview = [];
    let tempMyHistorical = [];
    let tempMyCanceled = [];
    let tempMyExpired = [];
    let tempMyClosed = [];
    let tempMyStalemate = [];
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
        } else if (b.status === "resolved" || b.status === "stalemate") {
          tempMyClosed.push(b);
          tempMyHistorical.push(b);
        } else if (b.status === "stalemate") {
          tempMyStalemate.push(b);
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
      myClosedBets: tempMyClosed,
      myStalemateBets: tempMyStalemate,
      openBets: tempOpen,
      openBetsName:
        this.props.local.localData.club.name === "Global"
          ? "Open Wagers Globally"
          : `Open Bets in ${this.props.local.localData.club.name}`
    });
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.global.globalData.bets !== newProps.global.globalData.bets ||
      this.props.local.localData.club.name !==
        newProps.local.localData.club.name
    ) {
      var tempMyOpen = [];
      var tempMyCurrent = [];
      var tempMyAdminReview = [];
      var tempMyReview = [];
      var tempMyHistorical = [];
      var tempMyCanceled = [];
      var tempMyExpired = [];
      var tempMyClosed = [];
      var tempMyStalemate = [];
      var tempOpen = [];
      newProps.global.globalData.bets.forEach(b => {
        if (b.is_my_bet) {
          if (
            b.status === "disputed" &&
            b.club_admin === Number(localStorage.id)
          ) {
            // fix this later by having multiple admins / mods and not having you decide if it is your own bet
            tempMyAdminReview.push(b);
          } else if (b.status === "pending") {
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
          } else if (b.status === "resolved" || b.status === "stalemate") {
            tempMyClosed.push(b);
            tempMyHistorical.push(b);
          }
        } else if (
          b.status === "pending" &&
          (newProps.local.localData.club.name === "Global" ||
            newProps.local.localData.club.id === b.club)
        ) {
          tempOpen.push(b);
        } else if (
          b.status === "disputed" &&
          b.club_admin === Number(localStorage.id)
        ) {
          tempMyAdminReview.push(b);
        }
      });
      this.setState({
        myOpenBets: tempMyOpen,
        myCurrentBets: tempMyCurrent,
        myAdminReview: tempMyAdminReview,
        myReviewBets: tempMyReview,
        myHistoricalBets: tempMyHistorical,
        myCanceledBets: tempMyCanceled,
        myExpiredBets: tempMyExpired,
        myClosedBets: tempMyClosed,
        myStalemateBets: tempMyStalemate,
        openBets: tempOpen
      });
    }
    this.setState({
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

  changeHistoryView(selected) {
    this.setState({ historyTab: selected });
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
              {this.state.myOpenBets.map(b => (
                <Bet
                  key={b.id}
                  bet={b}
                  display="large"
                  betSocket={this.props.betSocket}
                  notificationsSocket={this.props.notificationsSocket}
                />
              ))}
            </Tab>
            <Tab
              eventKey={2}
              title={"Active (" + this.state.myCurrentBets.length + ")"}
            >
              {this.state.myCurrentBets.map(b => (
                <Bet
                  key={b.id}
                  bet={b}
                  display="large"
                  betSocket={this.props.betSocket}
                  notificationsSocket={this.props.notificationsSocket}
                />
              ))}
            </Tab>
            <Tab
              eventKey={3}
              title={
                "Review (" +
                (this.state.myReviewBets.length +
                  this.state.myAdminReview.length) +
                ")"
              }
            >
              {this.state.myAdminReview.length ? (
                <div>
                  <h3>Admin dispute Review</h3>
                  {this.state.myAdminReview.map(b => (
                    <Bet
                      key={b.id}
                      bet={b}
                      display="large"
                      betSocket={this.props.betSocket}
                      notificationsSocket={this.props.notificationsSocket}
                    />
                  ))}{" "}
                  <h3>My Bets to Review</h3>
                </div>
              ) : null}
              {this.state.myReviewBets.map(b => (
                <Bet
                  key={b.id}
                  bet={b}
                  display="large"
                  betSocket={this.props.betSocket}
                  notificationsSocket={this.props.notificationsSocket}
                />
              ))}
            </Tab>
            <Tab
              eventKey={4}
              title={"History (" + this.state.myHistoricalBets.length + ")"}
            >
              <ButtonToolbar className="selectHistoryDropdown">
                <br />
                <DropdownButton title={this.state.historyTab + " "} id={1}>
                  <MenuItem
                    className="menu"
                    onSelect={() => this.changeHistoryView("Closed")}
                    key={1}
                    eventKey={1}
                  >
                    Closed
                  </MenuItem>
                  <MenuItem
                    className="menu"
                    onSelect={() => this.changeHistoryView("Expired")}
                    key={2}
                    eventKey={2}
                  >
                    Expired
                  </MenuItem>
                  <MenuItem
                    className="menu"
                    onSelect={() => this.changeHistoryView("Canceled")}
                    key={3}
                    eventKey={3}
                  >
                    Canceled
                  </MenuItem>
                </DropdownButton>
              </ButtonToolbar>
              <br />
              {this.state.historyTab === "Closed"
                ? this.state.myClosedBets.map(b => (
                    <Bet
                      key={b.id}
                      bet={b}
                      display="large"
                      betSocket={this.props.betSocket}
                      notificationsSocket={this.props.notificationsSocket}
                    />
                  ))
                : null}
              {this.state.historyTab === "Expired"
                ? this.state.myExpiredBets.map(b => (
                    <Bet
                      key={b.id}
                      bet={b}
                      display="large"
                      betSocket={this.props.betSocket}
                      notificationsSocket={this.props.notificationsSocket}
                    />
                  ))
                : null}
              {this.state.historyTab === "Canceled"
                ? this.state.myCanceledBets.map(b => (
                    <Bet
                      key={b.id}
                      bet={b}
                      display="large"
                      betSocket={this.props.betSocket}
                      notificationsSocket={this.props.notificationsSocket}
                    />
                  ))
                : null}
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
              {this.state.openBets.map(b => (
                <Bet
                  key={b.id}
                  bet={b}
                  display="large"
                  betSocket={this.props.betSocket}
                  notificationsSocket={this.props.notificationsSocket}
                />
              ))}
            </Tab>
            <Tab eventKey={6} title="Create Bet">
              <br />
              <CreateBet
                betSocket={this.props.betSocket}
                notificationsSocket={this.props.notificationsSocket}
              />
            </Tab>
          </Tabs>
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
