import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import ClubNav from "../ClubNav/index";
import GlobalNavBar from "../GlobalNavBar/GlobalNavBar";
import LoungeList from "../LoungeList/index";
import SearchBets from "../SearchBets/index.jsx";
import CreateBet from "../CreateBet/index.jsx";
import { fetchHomeData } from "../../actions";
import MainNavBar from "../MainNavBar/MainNavBar";
import Loading from "../Globals/Loading/Loading";
import UsersNav from "../UsersNav/UsersNav";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import "./Home.css";
import UserPane from "../UserPane/UserPane";

class Home extends Component {
  constructor() {
    super();
  }
  async componentDidMount() {
    // set app state here
    await this.props.fetchHomeData(
      localStorage.getItem("id"),
      localStorage.getItem("default_club")
    );
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
                <ClubNav />
              </Col>
              <Col
                xs={2}
                sm={2}
                md={2}
                style={{ backgroundColor: "rgb(47,49,54)", height: "93vh" }}
              >
                <LoungeList />
              </Col>
              <Col
                xs={7}
                sm={7}
                md={7}
                style={{ backgroundColor: "rgb(54,57,62)", height: "93vh" }}
              >
                <MainNavBar />
                <br />
                <SearchBets />
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
      fetchHomeData: fetchHomeData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(Home);
