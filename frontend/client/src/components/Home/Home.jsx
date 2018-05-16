import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import ClubNav from "../ClubNav/index";
import GlobalNavBar from "../GlobalNavBar/GlobalNavBar";
import LoungeList from "../LoungeList/index";
import SearchBets from "../SearchBets/index.jsx";
import CreateBet from "../CreateBet/index.jsx";
import {
  fetchHomeData,
  addBet,
  cancelMyBet,
  acceptBet,
  voteOnBet,
  addLounge
} from "../../actions";
import MainNavBar from "../MainNavBar/MainNavBar";
import Loading from "../Globals/Loading/Loading";
import UsersNav from "../UsersNav/UsersNav";
import ESportVid from "../ESport/ESportVid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import io from "socket.io-client";
import axios from "axios";
import "./Home.css";
import UserPane from "../UserPane/UserPane";

const betSocket = io("http://localhost:3000/bets");
const activeUserSocket = io("http://localhost:3000/activeUsers");

class Home extends Component {
  constructor() {
    super();
  }
  async componentDidMount() {
    // set app state here
    await this.props.fetchHomeData(localStorage.id, localStorage.default_club);

    betSocket.emit("user.enter", {
      user: localStorage.username,
      clubList: this.props.global.globalData.clubs
    });

    betSocket.on("bet.create", newBet => {
      this.props.addBet(this.props.global.globalData, newBet);
    });

    betSocket.on("lounge.create", newLounge => {
      console.log("i heard a new lounge ", newLounge);
      this.props.addLounge(this.props.local.localData, newLounge);
    });

    betSocket.on("bet.cancel", newBet => {
      this.props.cancelMyBet(this.props.global.globalData, newBet, 0);
    });

    betSocket.on("bet.accept", (newBet, acceptorId) => {
      this.props.acceptBet(
        this.props.global.globalData,
        newBet,
        0,
        "" + acceptorId,
        localStorage.id
      );
    });

    betSocket.on("bet.vote", (newBet, voterId, vote, whoAmI) => {
      this.props.voteOnBet(
        this.props.global.globalData,
        newBet,
        newBet.wager,
        vote,
        whoAmI, // is the voter the challenger or creator
        voterId,
        localStorage.id
      );
    });

    activeUserSocket.emit("user.enter", {
      username: localStorage.username,
      id: localStorage.id,
      online: "online"
    });

    activeUserSocket.on("user.enter", usersOnline => {
      console.log("fafafafafaf", usersOnline);
    });
    //console.log(io.sockets.clients("/activeUsers"));
  }

  betCreate(bet) {}

  render() {
    if (
      this.props.local.localData &&
      this.props.global.globalData &&
      this.props.userPane.userPaneData
    ) {
      return (
        <div>
          <Grid>
            <Row className="navbar-container">
              <Col
                md={12}
                align="center"
                style={{ backgroundColor: "rgb(37,39,44)", height: "7vh" }}
              >
                <GlobalNavBar history={this.props.history} />
              </Col>
            </Row>
            <Row>
              <Col
                xs={1}
                sm={1}
                md={1}
                style={{ backgroundColor: "rgb(37,39,44)", height: "93vh" }}
              >
                <ClubNav betSocket={betSocket} />
              </Col>
              <Col
                xs={2}
                sm={2}
                md={2}
                style={{ backgroundColor: "rgb(47,49,54)", height: "93vh" }}
              >
                <LoungeList betSocket={betSocket} />
              </Col>
              <Col
                xs={7}
                sm={7}
                md={7}
                style={{ backgroundColor: "rgb(54,57,62)", height: "93vh" }}
              >
                <MainNavBar betSocket={betSocket} />
                <br />
              </Col>
              <Col
                xs={2}
                sm={2}
                md={2}
                style={{ backgroundColor: "rgb(47,49,54)", height: "93vh" }}
              >
                <UsersNav />
                <UserPane />
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      // INJECT SOME LOADING SCREEN HERE
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    //globalData: state.globalData,
    local: state.local,
    global: state.global,
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      fetchHomeData: fetchHomeData,
      addBet: addBet,
      cancelMyBet: cancelMyBet,
      acceptBet: acceptBet,
      voteOnBet: voteOnBet,
      addLounge: addLounge
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Home);
