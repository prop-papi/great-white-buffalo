import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
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
                Global Nav Bar
              </Col>
            </Row>
            <Row>
              <Col md={1} style={{'backgroundColor': 'rgb(90,105,120)', 'height': '100%'}}>
                Club
              </Col>
              <Col md={2} style={{'backgroundColor': 'rgb(105,115,130)', 'height': '100%'}}>
                Lounge
              </Col>
              <Col md={6} style={{'backgroundColor': 'rgb(120,135,150)', 'height': '100%'}}>
                Media
              </Col>
              <Col md={3} style={{'backgroundColor': 'rgb(130,145,160)', 'height': '100%'}}>
                Friends
              </Col>
            </Row>
          </Grid>
        </div>
      )
    }
}

export default Home;