import React, { Component } from "react";
import axios from "axios";
import {
  FormGroup,
  FormControl,
  Input,
  Button,
  Form,
  Col,
  ControlLabel
} from "react-bootstrap";

import "./Auth.css";

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitAuthData = this.submitAuthData.bind(this);
  }

  async submitAuthData(e) {
    e.preventDefault();
    const { username, password } = this.state;
    const body = {
      username,
      password
    };
    console.log(body);
    try {
      const data = axios.post(`http://localhost:1337/api/auth/login`, body);
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("id", data.data.id);
      localStorage.setItem("token", data.data.token.accessToken);
      localStorage.setItem("win_ratio", data.data.win_ratio);
      localStorage.setItem("reputation", data.data.reputation);
      data
        ? this.props.history.push("/home")
        : this.props.history.push("/login");
    } catch (err) {
      throw new Error(err);
    }
  }

  handleInputChange(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
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

          {/* <FormGroup>
            <Col smOffset={2} sm={10}>
              <Checkbox>Remember me</Checkbox>
            </Col>
          </FormGroup> */}

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" onClick={e => this.submitAuthData(e)}>
                Sign in
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
