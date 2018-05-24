import React, { Component } from "react";
import axios from "axios";
import configs from "../../../../../config.js";
import {
  FormGroup,
  FormControl,
  Input,
  Button,
  Form,
  Col,
  ControlLabel,
  Alert
} from "react-bootstrap";

import "./Auth.css";

export default class Signup extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      passwordConfirm: "",
      showPasswordAlert: false,
      showUsernameAlert: false
    };

    this.alertStyle = {
      width: "200%",
      marginLeft: "225px",
      marginTop: "-150px"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitAuthData = this.submitAuthData.bind(this);
    this.handleDismissPasswordError = this.handleDismissPasswordError.bind(
      this
    );
    this.handleDismissUsernameError = this.handleDismissUsernameError.bind(
      this
    );
  }

  async submitAuthData(e) {
    e.preventDefault();
    const { username, password, passwordConfirm } = this.state;
    const body = {
      username,
      password
    };
    // check if input passwords are matching
    if (password !== passwordConfirm) {
      this.setState({ showPasswordAlert: true });
    } else {
      try {
        const data = await axios.post(`${configs.HOST}api/auth/signup`, body);
        // alert based on server response for exising user
        if (data.data === "Username already exists.") {
          this.setState({ showUsernameAlert: true });
        } else {
          localStorage.setItem("username", data.data[0].username);
          localStorage.setItem("id", data.data[0].id);
          localStorage.setItem("win_ratio", data.data[0].win_ratio);
          localStorage.setItem("reputation", data.data[0].reputation);
          localStorage.setItem("default_club", data.data[0].default_club);
          document.cookie = JSON.parse(data.headers.auth).token;
          // ****NOTE - ROUTE USERS TO HOME PAGE HERE****
        }
      } catch (err) {
        console.log("catch", err);
        throw new Error(err);
      }
    }
  }

  handleDismissPasswordError() {
    this.setState({
      showPasswordAlert: false,
      password: "",
      passwordConfirm: ""
    });
  }

  handleDismissUsernameError() {
    this.setState({
      showUsernameAlert: false,
      username: "",
      password: "",
      passwordConfirm: ""
    });
  }

  async handleInputChange(e) {
    e.preventDefault();
    const { value, name } = e.target;
    await this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="login-form-container row">
        <div className="col-md-4">
          <Form className="fontsPlease" horizontal>
            <FormGroup className="authField" controlId="formHorizontalUsername">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                className="login-form"
                value={this.state.username}
                type="username"
                name="username"
                onChange={this.handleInputChange}
              />
            </FormGroup>

            <FormGroup className="authField" controlId="formHorizontalPassword">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                className="login-form"
                value={this.state.password}
                type="password"
                name="password"
                onChange={this.handleInputChange}
              />
            </FormGroup>

            <FormGroup
              className="authField"
              controlId="formHorizontalPassword2"
            >
              <ControlLabel>Re-type Password</ControlLabel>
              <FormControl
                className="login-form"
                value={this.state.passwordConfirm}
                type="password"
                name="passwordConfirm"
                onChange={this.handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Button
                type="submit"
                className="authButton"
                onClick={e => this.submitAuthData(e)}
              >
                Sign Up
              </Button>
            </FormGroup>
            {this.state.showPasswordAlert ? (
              <Alert
                bsStyle="danger"
                style={this.alertStyle}
                onDismiss={this.handleDismissPasswordError}
              >
                <h4>Oh snap! You got an error!</h4>
                <p>Please input matching passwords.</p>
                <p>
                  <Button onClick={this.handleDismissPasswordError}>
                    Close
                  </Button>
                </p>
              </Alert>
            ) : null}
            {this.state.showUsernameAlert ? (
              <Alert
                bsStyle="danger"
                style={this.alertStyle}
                onDismiss={this.handleDismissUsernameError}
              >
                <h4>Oh snap! You got an error!</h4>
                <p>Username already exists, please choose a different one.</p>
                <p>
                  <Button onClick={this.handleDismissUsernameError}>
                    Close
                  </Button>
                </p>
              </Alert>
            ) : null}
          </Form>
        </div>
        <div className="col-md-6">
          <br />
          <span className="loginSignup">Sign Up</span>
          <div
            onClick={() => this.props.handleSwitch(1)}
            className="switchButton"
          >
            Click here to log in!
          </div>
        </div>
        <div className="col-md-2" />
      </div>
    );
  }
}
