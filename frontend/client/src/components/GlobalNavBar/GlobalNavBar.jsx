import React, { Component } from 'react';
import { Col, Glyphicon, Button, Image } from 'react-bootstrap';
import './GlobalNavBar.css';
class GlobalNavBar extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
          <Col align='left' md={2}>
            <Image className='logo' src='https://s3.us-east-2.amazonaws.com/great-white-buffalo/gwb-logo.png' rounded />
          </Col>
          <Col md={8} mdHidden={true}>
          </Col>
          <Col align='right' md={2}>
            <Button bsSize='large' className='glyph'>
              <Glyphicon glyph='align-justify' />
            </Button>
          </Col>
      </div>
    )
  }
}

export default GlobalNavBar;