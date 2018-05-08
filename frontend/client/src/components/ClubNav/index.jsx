import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Nav, NavItem, Image, Tooltip, OverlayTrigger } from "react-bootstrap";

import "./index.css";

class ClubNav extends Component {
  constructor() {
    super();

    this.handleNavItemClick = this.handleNavItemClick.bind(this);
  }

  handleNavItemClick(club) {
    console.log(club);
    // perform some routing and/or re-render new state of the page, overwrite local data store
  }

  render() {
    return (
      <div className="container">
        <Nav bsStyle="pills" stacked>
          <NavItem
            key={11}
            className="nav-item"
            onClick={() =>
              this.handleNavItemClick(this.props.data.globalData.clubs[11])
            }
          >
            <div className="club-logo-wrapper">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip">
                    {this.props.data.globalData.clubs[11].name}
                  </Tooltip>
                }
              >
                <Image
                  src={this.props.data.globalData.clubs[11].logo}
                  circle
                  responsive
                  className="nav-image"
                />
              </OverlayTrigger>
            </div>
          </NavItem>
          {this.props.data.globalData.clubs.map(club => {
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
    //globalData: state.globalData,
    data: state.data
  };
}

export default connect(mapStateToProps)(ClubNav);
