import React, { Component } from "react";
import configs from "../../../../../config.js";
import { ListGroupItem, Image, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserPaneData } from "../../actions";
import axios from "axios";
import "./index.css";

class BetAcceptMessage extends Component {
  constructor(props) {
    super(props);
    this.displaySideProfile = this.displaySideProfile.bind(this);
  }

  displaySideProfile(target) {
    let params = {
      username: target.currentTarget.innerHTML
    };
    this.props.close();
    axios
      .get(`${configs.HOST}api/userpane/selected`, { params })
      .then(response => {
        let newUserPane = Object.assign({}, this.props.userPane.userPaneData);
        newUserPane.didSelectUser = true;
        newUserPane.selectedUser = response.data[0];
        this.props.updateUserPaneData(newUserPane);
        this.props.close();
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  render() {
    return (
      <div className="notification-wrapper">
        <ul className="horizontal-list notifications-list" role="navigation">
          <li className="logo-li-item li">
            <Image
              className="notification-logo"
              src={this.props.data.partner_picture}
              rounded
            />
          </li>
          <li className="li li-message">
            <p className="notification-message">
              Your bet: <strong>{this.props.data.description}</strong> was
              accepted by{" "}
              <strong>
                <span
                  className="user-in-message"
                  onClick={this.displaySideProfile}
                >
                  {this.props.data.partner_username}
                </span>
              </strong>
            </p>
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userPane: state.userPane
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      // setTestData: setTestData
      updateUserPaneData: updateUserPaneData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(
  BetAcceptMessage
);
