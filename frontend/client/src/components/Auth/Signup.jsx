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
      showAlert: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitAuthData = this.submitAuthData.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  async submitAuthData(e) {
    e.preventDefault();
    const { username, password, passwordConfirm } = this.state;
    const body = {
      username,
      password
    };
    // check if input passwords are matching here
    if (password !== passwordConfirm) {
      console.log("passwords not matching");
      this.setState({ showAlert: true });
    } else {
      try {
        const data = await axios.post(
          `http://localhost:1337/api/auth/signup`,
          body
        );
        data
          ? this.props.history.push("/login")
          : this.props.history.push("/auth");
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  handleDismiss() {
    this.setState({
      showAlert: false,
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
        {this.state.showAlert ? (
          <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
            <h4>Oh snap! You got an error!</h4>
            <p>Please input matching passwords.</p>
            <p>
              <Button onClick={this.handleDismiss}>Close</Button>
            </p>
          </Alert>
        ) : null}
        <Form horizontal>
          <FormGroup controlId="formHorizontalUsername">
            <Col componentClass={ControlLabel} sm={2}>
              Username:
            </Col>
            <Col sm={10}>
              <FormControl
                className="login-form"
                type="username"
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
        </Form>
      </div>
    );
  }
}
