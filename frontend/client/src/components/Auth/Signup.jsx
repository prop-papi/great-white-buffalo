import React, { Component } from "react";
import axios from "axios";
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
      width: "42%",
      marginLeft: "10px"
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
        const data = await axios.post(
          `http://localhost:1337/api/auth/signup`,
          body
        );
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
      <div className="login-form-container">
        <Form horizontal>
          <FormGroup controlId="formHorizontalUsername">
            <Col componentClass={ControlLabel} sm={2}>
              Username:
            </Col>
            <Col sm={10}>
              <FormControl
                className="login-form"
                type="username"
                value={this.state.username}
                name="username"
                placeholder="Username"
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Password:
            </Col>
            <Col sm={10}>
              <FormControl
                className="login-form"
                type="password"
                value={this.state.password}
                name="password"
                placeholder="Password"
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword2">
            <Col componentClass={ControlLabel} sm={2}>
              Re-type Password:
            </Col>
            <Col sm={10}>
              <FormControl
                className="login-form"
                type="password"
                value={this.state.passwordConfirm}
                name="passwordConfirm"
                placeholder="Re-type Password"
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" onClick={e => this.submitAuthData(e)}>
                Sign Up
              </Button>
            </Col>
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
                <Button onClick={this.handleDismissPasswordError}>Close</Button>
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
                <Button onClick={this.handleDismissUsernameError}>Close</Button>
              </p>
            </Alert>
          ) : null}
        </Form>
      </div>
    );
  }
}
