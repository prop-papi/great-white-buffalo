import React, { Component } from 'react';
import { Grid, Col, Row, Button } from 'react-bootstrap';
import './MainNavBar.css';

class MainNavBar extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <Grid>
          <Col align='center' md={4}>
            <Button>Video</Button>
          </Col>
          <Col align='center' md={4}>
            <Button>Wagers</Button>
          </Col>
          <Col align='center' md={4}>
            <Button>Chat</Button>
          </Col>
        </Grid>
      </div>
    )
  }
}

export default MainNavBar;