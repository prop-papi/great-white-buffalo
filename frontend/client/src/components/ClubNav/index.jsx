import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateLocalData } from "../../actions";
import axios from "axios";

import { Nav, NavItem, Image, Tooltip, OverlayTrigger } from "react-bootstrap";

import "./index.css";

class ClubNav extends Component {
  constructor() {
    super();
    this.handleNavItemClick = this.handleNavItemClick.bind(this);
  }

  handleNavItemClick(club) {
    console.log(club);
    this.props.updateLocalData(club.id);
    // update default club in db
    let body = {
      user: localStorage.getItem("id"),
      club: club.id
    };
    let updatedClub = axios.post(
      "http://localhost:1337/api/clubs/updateDefault",
      body
    );
  }

  render() {
    return (
      <div className="club-container">
        <Nav bsStyle="pills" stacked>
          <NavItem
            key={this.props.global.globalData.globalClub[0].id}
            className="nav-item"
            onClick={() =>
              this.handleNavItemClick(
                this.props.global.globalData.globalClub[0]
              )
            }
          >
            <div className="club-logo-wrapper">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip">
                    {this.props.global.globalData.globalClub[0].name}
                  </Tooltip>
                }
              >
                <Image
                  src={this.props.global.globalData.globalClub[0].logo}
                  circle
                  responsive
                  className="nav-image"
                />
              </OverlayTrigger>
            </div>
          </NavItem>
          {this.props.global.globalData.defaultClub[0].id !== 12 ? (
            <NavItem
              active
              key={this.props.global.globalData.defaultClub[0].id}
              className="nav-item"
              onClick={() =>
                this.handleNavItemClick(
                  this.props.global.globalData.defaultClub[0]
                )
              }
            >
              <div className="club-logo-wrapper">
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="tooltip">
                      {this.props.global.globalData.defaultClub[0].name}
                    </Tooltip>
                  }
                >
                  <Image
                    src={this.props.global.globalData.defaultClub[0].logo}
                    circle
                    responsive
                    className="nav-image"
                  />
                </OverlayTrigger>
              </div>
            </NavItem>
          ) : null}
          {this.props.global.globalData.clubs.map(club => {
            if (
              club.id !== 12 &&
              club.id !== this.props.global.globalData.defaultClub[0].id
            ) {
              return (
                <NavItem
                  key={club.id}
                  className="nav-item"
                  onClick={() => this.handleNavItemClick(club)}
                >
                  <div className="club-logo-wrapper">
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip id="tooltip">{club.name}</Tooltip>}
                    >
                      <Image
                        src={club.logo}
                        circle
                        responsive
                        className="nav-image"
                      />
                    </OverlayTrigger>
                  </div>
                </NavItem>
              );
            }
          })}
        </Nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    global: state.global
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateLocalData: updateLocalData
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(ClubNav);
