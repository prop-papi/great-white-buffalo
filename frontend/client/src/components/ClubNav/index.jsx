import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateLocalData, addClub } from "../../actions";
import axios from "axios";

import {
  Nav,
  NavItem,
  Modal,
  MenuItem,
  Image,
  Tooltip,
  OverlayTrigger,
  ButtonToolbar,
  DropdownButton,
  Button
} from "react-bootstrap";

import "./index.css";

class ClubNav extends Component {
  constructor() {
    super();

    this.state = {
      show: false,
      security: "Public",
      clubName: "",
      logo: ""
    };

    this.handleNavItemClick = this.handleNavItemClick.bind(this);
    this.createClub = this.createClub.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.selectSecurity = this.selectSecurity.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleNavItemClick(club) {
    this.props.updateLocalData(club.id);
    // update default club in db
    let body = {
      user: localStorage.getItem("id"),
      club: club.id
    };
    localStorage.setItem("default_club", club.id);
    let updatedClub = axios.post(
      "http://localhost:1337/api/clubs/updateDefault",
      body
    );
  }

  async createClub() {
    // do i need to send a socket broadcast here to let everyone know there is a new club?
    console.log("create club ", this.state.clubName, this.state.security);
    const body = {
      name: this.state.clubName,
      security: this.state.security,
      logo: this.state.logo,
      adminId: localStorage.id
    };
    try {
      const data = await axios.post(
        `http://localhost:1337/api/clubs/insertclub`,
        body
      );
      if (data.status === 200) {
        const newClub = data.data;
        console.log(newClub);
        this.props.addClub(this.props.global.globalData, newClub);
        // do i want anything like the below from the lounge creation?
        // if (newLounge.security === "public") {
        //   const payload = {
        //     lounge: newLounge,
        //     action: "newLounge"
        //   };
        //   console.log("payload", payload);
        //   this.props.betSocket.emit("bet", payload);
        // }
        this.setState({ show: false, clubName: "", logo: "" });
        this.props.betSocket.emit("user.enter", {
          user: localStorage.username,
          clubList: [newClub]
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  selectSecurity(e) {
    if (e === 1) {
      this.setState({ security: "Public" });
    } else if (e === 2) {
      this.setState({ security: "Private" });
    }
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleCancel() {
    this.setState({ show: false });
    // this and the button shouldn't be neccesary...figure out modal issue, link below, just didn't want to get stuck on it
    // https://github.com/react-bootstrap/react-bootstrap/issues/2812
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
          <NavItem
            key={"create"}
            className="nav-item"
            onClick={this.handleShow}
          >
            <div className="club-logo-wrapper">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="tooltip">Create a Club</Tooltip>}
              >
                <Image
                  src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/plus.png"
                  circle
                  responsive
                  className="nav-image"
                />
              </OverlayTrigger>
            </div>
          </NavItem>
        </Nav>
        <Modal show={this.state.show} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Create a Club</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Club name:{" "}
            <input
              type="text"
              name="clubName"
              style={{ width: 100 }}
              value={this.state.clubName}
              onChange={this.handleChange}
            />{" "}
            <br />
            Logo url:{" "}
            <input
              type="text"
              name="logo"
              style={{ width: 100 }}
              value={this.state.logo}
              onChange={this.handleChange}
            />{" "}
            <br />
            <ButtonToolbar className="testing" id="securityButton">
              <DropdownButton title={this.state.security} id={1}>
                <MenuItem
                  className="menu"
                  onSelect={this.selectSecurity}
                  key={1}
                  eventKey={1}
                >
                  Public
                </MenuItem>
                <MenuItem
                  className="menu"
                  onSelect={this.selectSecurity}
                  key={2}
                  eventKey={2}
                >
                  Private
                </MenuItem>
              </DropdownButton>
            </ButtonToolbar>
            <br /> <br />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.createClub}>Create Club</Button>
          </Modal.Footer>
        </Modal>
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
      updateLocalData: updateLocalData,
      addClub: addClub
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(ClubNav);
