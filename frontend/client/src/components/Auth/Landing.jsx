import React from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { Image, Modal } from "react-bootstrap";

import "./Landing.css";

export default class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      which: 1,
      show: false
    };
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSwitch(s) {
    this.setState({ which: s });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleCancel() {
    this.setState({ show: false });
  }

  render() {
    return (
      <div className="row" id="wholeLandingPage">
        <div className="col-md-6 logoSide">
          <Image
            className="largeLogo"
            src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/updated-logo.png"
            rounded
          />
        </div>
        <div className="col-md-6 formSide">
          <div className="row formSideContent">
            <div className="companyName">GREAT</div>
            <div className="companyName">WHITE</div>
            <div className="companyName">BUFFALO</div>
            <div className="slogonBox">
              <span> Make a Wager with GW Buff </span>
            </div>
            <div className="logOrSign">
              {this.state.which === 1 ? (
                <Login
                  history={this.props.history}
                  handleSwitch={this.handleSwitch}
                />
              ) : (
                <Signup
                  history={this.props.history}
                  handleSwitch={this.handleSwitch}
                />
              )}
            </div>
          </div>
        </div>
        <div onClick={this.handleShow} className="butWhy">
          But why white buffalo?
        </div>
        <Modal show={this.state.show} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>The Legend of the Great White Buffalo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            White buffalo are extremely rare; the National Bison Association has
            estimated that they only occur in approximately one out of every 10
            million births. The GREAT White Buffalo is even more elusive. Some
            people go their entire lives without ever encountering a Great White
            Buffalo. Don't let your Great White Buffalo get away. Find your
            wager today.
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
