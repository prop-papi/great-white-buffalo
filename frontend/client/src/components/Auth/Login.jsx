import React, { Component } from 'react';
import axios from 'axios';
import {
  FormGroup,
  FormControl,
  Input,
  Button,
  Form,
  Col,
  ControlLabel,
  Alert
} from 'react-bootstrap';

import './Auth.css';

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      showLoginErrorAlert: false
    };

    this.alertStyle = {
      width: '42%',
      marginLeft: '10px'
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
      const data = await axios.post(
        `http://localhost:1337/api/auth/login`,
        body
      );
      localStorage.setItem('username', data.data[0].username);
      localStorage.setItem('id', data.data[0].id);
      localStorage.setItem('win_ratio', data.data[0].win_ratio);
      localStorage.setItem('reputation', data.data[0].reputation);
      localStorage.setItem('default_club', data.data[0].default_club);
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
      username: '',
      password: ''
    });
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
                value={this.state.username}
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
                value={this.state.password}
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" onClick={e => this.submitAuthData(e)}>
                Sign in
              </Button>
            </Col>
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
    );
  }
}
