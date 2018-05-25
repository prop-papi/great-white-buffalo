import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import configs from "../../../../../config.js";
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { updateUserPaneData } from "../../actions";
import axios from "axios";

// custom css (if needed)
import "./Leaderboard.css";

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.displaySideProfile = this.displaySideProfile.bind(this);
    this.sortBySelector = this.sortBySelector.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);

    this.state = {
      wins: [],
      losses: [],
      totalBets: [],
      winPercentage: [],
      availableBalance: [],
      sortBy: "wins"
    };
  }

  sortBySelector() {
    let { sortBy, wins } = this.state;

    return this.state[sortBy].map((entry, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>
          <a className="leaderboard-username" onClick={this.displaySideProfile}>
            {entry.username}
          </a>
        </td>
        <td>{entry.reputation}</td>
        <td>{entry.wins} </td>
        <td>{entry.losses}</td>
        <td>{entry.totalBets}</td>
        <td>
          {parseFloat(Math.round(entry.win_ratio * 10000) / 100).toFixed(2)}%
        </td>
        <td>{entry.available_balance}</td>
      </tr>
    ));
  }

  tooltip(columnName) {
    return (
      <Tooltip id="tooltip">
        <strong>Click HERE</strong> to sort by <strong>{columnName}</strong>
      </Tooltip>
    );
  }

  onClickHandler(sortByValue) {
    this.setState({
      sortBy: sortByValue
    });
  }

  displaySideProfile(target) {
    console.log("display my shit");
    let params = {
      username: target.currentTarget.innerHTML
    };
    axios
      .get(`${configs.HOST}api/userpane/selected`, { params })
      .then(response => {
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        newUserPane.selectedUser = response.data[0];
        this.props.updateUserPaneData(newUserPane);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  componentDidMount() {
    axios
      .get(`${configs.HOST}api/leaderboard/`)
      .then(res => {
        console.log("res: ", res);
        this.setState({
          wins: res.data.wins,
          losses: res.data.losses,
          totalBets: res.data.totalBets,
          winPercentage: res.data.win_ratio,
          availableBalance: res.data.available_balance
        });
      })
      .catch(err => {
        console.log("Server error: ", err);
      });
  }

  render() {
    return (
      <div className="leaderboard-container">
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Reputation</th>
              <OverlayTrigger placement="top" overlay={this.tooltip("Wins")}>
                <th onClick={() => this.onClickHandler("wins")}>Wins</th>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={this.tooltip("Losses")}>
                <th onClick={() => this.onClickHandler("losses")}>Losses</th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={this.tooltip("Total Bets")}
              >
                <th onClick={() => this.onClickHandler("totalBets")}>
                  Total Bets
                </th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={this.tooltip("Win Percentage")}
              >
                <th onClick={() => this.onClickHandler("winPercentage")}>
                  Win Percentage
                </th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={this.tooltip("Token Count")}
              >
                <th onClick={() => this.onClickHandler("availableBalance")}>
                  Tokens
                </th>
              </OverlayTrigger>
            </tr>
          </thead>
          <tbody>{this.sortBySelector()}</tbody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Leaderboard);
