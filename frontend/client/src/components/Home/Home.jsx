import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import ClubNav from "../ClubNav/index";
import GlobalNavBar from "../GlobalNavBar/GlobalNavBar";
import LoungeList from "../LoungeList/index";
import SearchBets from "../SearchBets/index.jsx";
import CreateBet from "../CreateBet/index.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import configs from "../../../../../config.js";
import {
  fetchHomeData,
  addBet,
  cancelMyBet,
  acceptBet,
  voteOnBet,
  addLounge,
  updateNotifications,
  externalResolved,
  voting,
  expired
} from "../../actions";
import MainNavBar from "../MainNavBar/MainNavBar";
import Loading from "../Globals/Loading/Loading";
import UsersNav from "../UsersNav/UsersNav";
import SportVid from "../Sport/SportVid";
import Chat from "../Chat/Chat.jsx";
import Leaderboard from "../Leaderboard/Leaderboard.jsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import io from "socket.io-client";
import axios from "axios";
import "./Home.css";
import UserPane from "../UserPane/UserPane";

const betSocket = io(`${configs.SOCKET_HOST}bets`);
const activeUserSocket = io(`${configs.SOCKET_HOST}activeUsers`);
const notificationsSocket = io(`${configs.SOCKET_HOST}notifications`);

class Home extends Component {
  constructor(props) {
    super(props);

    this.mainComponentRender = this.mainComponentRender.bind(this);

    this.state = {
      usersOnline: {}
    };

    this.createNotification = this.createNotification.bind(this);
  }

  mainComponentRender(componentName) {
    if (componentName === "chat") {
      return <Chat />;
    } else if (componentName === "video") {
      return <SportVid />;
    } else if (componentName === "leaderboard") {
      return <Leaderboard />;
    } else {
      return (
        <SearchBets
          betSocket={betSocket}
          notificationsSocket={notificationsSocket}
        />
      );
    }
  }

  async componentDidMount() {
    const {
      fetchHomeData,
      addBet,
      addLounge,
      cancelMyBet,
      acceptBet,
      voteOnBet,
      externalResolved,
      voting,
      expired
    } = this.props;

    await fetchHomeData(localStorage.id, localStorage.default_club);

    betSocket.emit("user.enter", {
      user: localStorage.username,
      clubList: this.props.global.globalData.clubs
    });

    betSocket.on("bet.create", newBet => {
      addBet(this.props.global.globalData, newBet);
    });

    betSocket.on("lounge.create", newLounge => {
      addLounge(this.props.local.localData, newLounge);
    });

    betSocket.on("bet.cancel", newBet => {
      cancelMyBet(this.props.global.globalData, newBet, 0);
    });

    betSocket.on("bet.accept", (newBet, acceptorId) => {
      acceptBet(
        this.props.global.globalData,
        newBet,
        0,
        "" + acceptorId,
        localStorage.id
      );
    });

    betSocket.on("bet.vote", (newBet, voterId, vote, whoAmI) => {
      voteOnBet(
        this.props.global.globalData,
        newBet,
        newBet.wager,
        vote,
        whoAmI, // is the voter the challenger or creator
        voterId,
        localStorage.id
      );
    });

    betSocket.on("bet.externalResolved", (newBet, vote) => {
      externalResolved(this.props.global.globalData, newBet, vote);
    });

    betSocket.on("bet.expired", bet => {
      expired(this.props.global.globalData, bet);
    });

    activeUserSocket.emit("user.enter", {
      username: localStorage.username,
      id: localStorage.id,
      online: "online"
    });

    activeUserSocket.on("user.enter", usersOnline => {
      this.setState({ usersOnline });
    });

    activeUserSocket.on("user.leave", usersOnline => {
      this.setState({ usersOnline });
    });

    notificationsSocket.on(`newFriend-${localStorage.username}`, async user => {
      await this.props.updateNotifications(localStorage.id);
      // render some pop-up that tells you there's a new notification
      this.createNotification(`${user} accepted your friend request!`);
    });

    notificationsSocket.on(
      `incoming-request-${localStorage.username}`,
      async user => {
        await this.props.updateNotifications(localStorage.id);
        // render some pop-up that tells you there's a new notification
        this.createNotification(`${user} wants to be your friend!`);
      }
    );

    notificationsSocket.on(
      `noNewFriends-${localStorage.username}`,
      async user => {
        await this.props.updateNotifications(localStorage.id);
        // render some pop-up that tells you there's a new notification
        this.createNotification(`${user} declined your friend request :(`);
      }
    );

    notificationsSocket.on(
      `betAccepted-${localStorage.username}`,
      async payload => {
        await this.props.updateNotifications(localStorage.id);
        // render some pop-up that tells you there's a new notification
        this.createNotification(
          `${payload.user} accepted your wager: ${payload.bet} in Club ${
            payload.club
          }!`
        );
      }
    );

    notificationsSocket.on(
      `betVoting-${localStorage.username}`,
      async (payload, bet) => {
        await this.props.updateNotifications(localStorage.id);
        // FOR DEREK - the bet parameter contains the entire bet object here, i'm using the payload
        // render some pop-up that tells you there's a new notification
        await voting(this.props.global.globalData, bet);
        this.createNotification(
          `Your wager: ${payload.bet} in ${payload.club} with ${
            payload.challenger
          } is finished! Submit the results in the Reviews tab.`
        );
      }
    );

    notificationsSocket.on(`betWon-${localStorage.username}`, async payload => {
      await this.props.updateNotifications(localStorage.id);
      // render some pop-up that tells you there's a new notification
      this.createNotification(
        `Congrats! You won your bet: ${payload.bet} against ${payload.loser}.`
      );
    });
  }

  createNotification(message) {
    toast(message, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true
    });
  }

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
                <GlobalNavBar
                  history={this.props.history}
                  notificationsSocket={notificationsSocket}
                />
              </Col>
            </Row>
            <Row>
              <Col
                xs={1}
                sm={1}
                md={1}
                style={{ backgroundColor: "rgb(37,39,44)", height: "93vh" }}
                className="club-column"
              >
                <ClubNav betSocket={betSocket} />
              </Col>
              <Col
                xs={2}
                sm={2}
                md={2}
                style={{ backgroundColor: "rgb(47,49,54)", height: "93vh" }}
                className="lounge-column"
              >
                <LoungeList betSocket={betSocket} />
              </Col>
              <Col
                xs={7}
                sm={7}
                md={7}
                style={{ backgroundColor: "rgb(54,57,62)", height: "93vh" }}
                className="main-column"
              >
                <MainNavBar />
                <br />
                {this.mainComponentRender(this.props.main.component)}
              </Col>
              <Col
                xs={2}
                sm={2}
                md={2}
                style={{ backgroundColor: "rgb(47,49,54)", height: "93vh" }}
                className="userpane-column"
              >
                <UsersNav />
                <UserPane
                  usersOnline={this.state.usersOnline}
                  notificationsSocket={notificationsSocket}
                />
              </Col>
            </Row>
          </Grid>
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
          />
          <ToastContainer />
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
    userPane: state.userPane,
    main: state.component,
    currentLounge: state.currentLounge
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
      addLounge: addLounge,
      updateNotifications: updateNotifications,
      externalResolved: externalResolved,
      voting: voting,
      expired: expired
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Home);
