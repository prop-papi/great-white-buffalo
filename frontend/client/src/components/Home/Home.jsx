import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ClubNav from '../ClubNav/index';
import GlobalNavBar from '../GlobalNavBar/GlobalNavBar';
import LoungeList from '../LoungeList/index';
import CreateBet from '../CreateBet/index.jsx';
import MainNavBar from '../MainNavBar/MainNavBar';
import "./Home.css";

class Home extends Component {
    constructor() {
      super()
    }

    render() {
      return (
        <div>
          <Grid>
            <Row style={{'height': '10%'}}>
              <Col md={12} align='center' style={{'backgroundColor': 'rgb(90,105,120)', 'height': '100%'}}>
                <GlobalNavBar />
              </Col>
            </Row>
            <Row>
              <Col xs={1} sm={1 } md={1} style={{'backgroundColor': 'rgb(90,105,120)', 'height': '100%'}}>
                <ClubNav/>
              </Col>
              <Col xs={2} sm={2} md={2} style={{'backgroundColor': 'rgb(100,115,130)', 'height': '100%'}}>
                <LoungeList />
              </Col>
              <Col xs={6} sm={6} md={6} style={{'backgroundColor': 'rgb(120,135,150)', 'height': '100%'}}>
                <MainNavBar />
                <CreateBet />
              </Col>
              <Col xs={3} sm={3} md={3} style={{'backgroundColor': 'rgb(130,145,160)', 'height': '100%'}}>
                Friends
              </Col>
            </Row>
          </Grid>
        </div>
      )
    }
}

export default Home;