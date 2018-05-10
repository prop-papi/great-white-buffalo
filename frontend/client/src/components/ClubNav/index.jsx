import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateLocalData } from "../../actions";

import { Nav, NavItem, Image, Tooltip, OverlayTrigger } from "react-bootstrap";

import "./index.css";

class ClubNav extends Component {
  constructor() {
    super();
    this.handleNavItemClick = this.handleNavItemClick.bind(this);
  }

  handleNavItemClick(club) {
    this.props.updateLocalData(club.id);
  }

  render() {
    return (
      <div className="club-container">
        <Nav bsStyle="pills" stacked>
          <NavItem
            key={11}
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
          {this.props.global.globalData.clubs.map(club => {
            console.log(this.props.global.globalData.globalClub[0].id);
            if (club.id !== 12) {
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
