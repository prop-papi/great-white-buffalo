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

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      showLoginErrorAlert: false
    };

    this.alertStyle = {
      width: "200%",
      marginLeft: "225px",
      marginTop: "-90px"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitAuthData = this.submitAuthData.bind(this);
    this.handleDismissLoginError = this.handleDismissLoginError.bind(this);
  }

  async submitAuthData(e) {
    e.preventDefault();
    const { username, password } = this.state;
    const body = {
      username,
      password
    };
    try {
      const data = await axios.post(`${configs.HOST}api/auth/login`, body);
      localStorage.setItem("username", data.data[0].username);
      localStorage.setItem("id", data.data[0].id);
      localStorage.setItem("win_ratio", data.data[0].win_ratio);
      localStorage.setItem("reputation", data.data[0].reputation);
      localStorage.setItem("default_club", data.data[0].default_club);
      document.cookie = JSON.parse(data.headers.auth).token;
      this.props.history.push("/home");
    } catch (err) {
      this.setState({ showLoginErrorAlert: true });
      throw new Error(err);
    }
  }

  handleInputChange(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  handleDismissLoginError() {
    this.setState({
      showLoginErrorAlert: false,
      username: "",
      password: ""
    });
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
            <FormGroup>
              <Button
                type="submit"
                className="authButton"
                onClick={e => this.submitAuthData(e)}
              >
                Sign in
              </Button>
            </FormGroup>
            {this.state.showLoginErrorAlert ? (
              <Alert
                bsStyle="danger"
                style={this.alertStyle}
                onDismiss={this.handleDismissLoginError}
              >
                <h4>Oh snap! You got an error!</h4>
                <p>Invalid username/password credentials, please try again.</p>
                <p>
                  <Button onClick={this.handleDismissLoginError}>Close</Button>
                </p>
              </Alert>
            ) : null}
          </Form>
        </div>
        <div className="col-md-6">
          <br />
          <span className="loginSignup">Login</span>
          <div
            onClick={() => this.props.handleSwitch(0)}
            className="switchButton"
          >
            Click here to create an account!
          </div>
        </div>
        <div className="col-md-2" />
      </div>
    );
  }
}
