import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateLocalData, addClub, fetchHomeData } from "../../actions";
import { updateCurrentLounge } from "../../actions/loungeActions";
import axios from "axios";
import configs from "../../../../../config.js";

import {
  Nav,
  NavItem,
  Modal,
  MenuItem,
  Image,
  Tabs,
  Tab,
  Tooltip,
  OverlayTrigger,
  ButtonToolbar,
  DropdownButton,
  Button
} from "react-bootstrap";

import "./index.css";
const CREATE_CLUB = "Create Club";
const JOIN_CLUB = "Join Club(s)";
const LEAVE_CLUB = "Leave Club(s)";

class ClubNav extends Component {
  constructor() {
    super();

    this.state = {
      show: false,
      security: "Public",
      clubName: "",
      logo: "",
      availableClubs: [],
      availableClubsClickMap: {},
      leavableClubsClickMap: {},
      loading: false,
      tabs: {
        1: CREATE_CLUB,
        2: JOIN_CLUB,
        3: LEAVE_CLUB
      },
      selectedTab: ""
    };

    this.handleNavItemClick = this.handleNavItemClick.bind(this);
    this.createClub = this.createClub.bind(this);
    this.joinClubs = this.joinClubs.bind(this);
    this.leaveClubs = this.leaveClubs.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.selectSecurity = this.selectSecurity.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAvailableClick = this.handleAvailableClick.bind(this);
    this.handleLeaveClick = this.handleLeaveClick.bind(this);
  }

  async handleNavItemClick(club) {
    await this.props.updateLocalData(club.id);
    // update default club in db
    let body = {
      user: localStorage.getItem("id"),
      club: club.id
    };
    localStorage.setItem("default_club", club.id);
    let updatedClub = axios.post(
      `${configs.HOST}api/clubs/updateDefault`,
      body
    );
    this.props.updateCurrentLounge(this.props.local.localData.lounges[0]);
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
        `${configs.HOST}api/clubs/insertclub`,
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

  async joinClubs() {
    try {
      const add = [];
      for (var key in this.state.availableClubsClickMap) {
        if (this.state.availableClubsClickMap[key]) {
          add.push([Number(key), Number(localStorage.id)]);
        }
      }
      const data = await axios.post(`${configs.HOST}api/clubs/addUsersClubs`, {
        add
      });
      if (data.status === 200) {
        this.setState({ loading: true });
        await this.props.fetchHomeData(
          localStorage.id,
          localStorage.default_club
        );
        this.setState({ loading: false });
      }
      this.setState({ show: false });
    } catch (err) {
      throw new Error(err);
    }
  }

  async leaveClubs() {
    try {
      const leave = [];
      for (var key in this.state.leavableClubsClickMap) {
        if (this.state.leavableClubsClickMap[key]) {
          leave.push([Number(key), Number(localStorage.id)]);
        }
      }
      const data = await axios.post(
        `${configs.HOST}api/clubs/removeUsersClubs`,
        { leave }
      );
      if (data.status === 200) {
        this.setState({ loading: true });
        await this.props.fetchHomeData(
          localStorage.id,
          localStorage.default_club
        );
        this.setState({ loading: false });
      }
      this.setState({ show: false });
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

  async handleShow() {
    this.setState({ show: true, selectedTab: "Create Club" });
    try {
      const params = { userId: localStorage.id };
      const data = await axios.get(
        `${configs.HOST}api/clubs/getAvailableClubs`,
        { params }
      );
      if (data.status === 200) {
        const tempAvailClickMap = {};
        const tempLeavableClickMap = {};
        data.data.forEach(c => {
          tempAvailClickMap[c.id] = false;
        });
        this.props.global.globalData.clubs.forEach(c => {
          tempLeavableClickMap[c.id] = false;
        });
        this.setState({
          availableClubs: data.data,
          availableClubsClickMap: tempAvailClickMap,
          leavableClubsClickMap: tempLeavableClickMap
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  handleAvailableClick(c) {
    this.setState(prevState => ({
      availableClubsClickMap: {
        ...prevState.availableClubsClickMap,
        [c.id]: !prevState.availableClubsClickMap[c.id]
      }
    }));
  }

  handleLeaveClick(c) {
    this.setState(prevState => ({
      leavableClubsClickMap: {
        ...prevState.leavableClubsClickMap,
        [c.id]: !prevState.leavableClubsClickMap[c.id]
      }
    }));
  }

  handleCancel() {
    this.setState({ show: false });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSelectedTab(e) {
    this.setState({ selectedTab: this.state.tabs[e] });
  }

  handleClubAction(e) {
    console.log("testing right here", e.target.value === JOIN_CLUB);
    if (e.target.value === CREATE_CLUB) {
      this.createClub();
    } else if (e.target.value === JOIN_CLUB) {
      console.log("JOINED");
      this.joinClubs();
    } else if (e.target.value === LEAVE_CLUB) {
      this.leaveClubs();
    }
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
                overlay={<Tooltip id="tooltip">Club Maintenance</Tooltip>}
              >
                <Image
                  src="https://i.imgur.com/ZH5iMOH.png"
                  circle
                  responsive
                  className="nav-image"
                />
              </OverlayTrigger>
            </div>
          </NavItem>
        </Nav>
        <Modal
          show={this.state.show}
          onHide={this.handleCancel}
          className="clubModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Club Maintenance</Modal.Title>
          </Modal.Header>

          <Tabs
            defaultActiveKey={1}
            id="uncontrolled-tab-example"
            onSelect={e => this.handleSelectedTab(e)}
          >
            <Tab eventKey={1} title="Create">
              <Modal.Body>
                <div className="row">
                  <div className="col-md-3">Club name: </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="clubName"
                      style={{ width: 100 }}
                      value={this.state.clubName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="col-md-2" />
                  <div className="col-md-3">
                    <ButtonToolbar /*className="testing" id="securityButton"*/>
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
                  </div>
                  <div className="col-md-1" />
                </div>
                <br />
                <div className="row">
                  <div className="col-md-3">Logo URL: </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      name="logo"
                      style={{ width: 100 }}
                      value={this.state.logo}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <br />
                <br />
              </Modal.Body>
            </Tab>
            <Tab eventKey={2} title="Join" className="joinLeaveClubsPane">
              <Modal.Body>
                <br />
                {this.state.loading
                  ? "Loading data for new clubs..."
                  : this.state.availableClubs.length
                    ? this.state.availableClubs.map(club => (
                        <NavItem
                          key={club.id}
                          className="nav-item"
                          className={
                            this.state.availableClubsClickMap[club.id]
                              ? "joinLeaveClubInd-selected"
                              : "joinLeaveClubInd"
                          }
                          onClick={() => this.handleAvailableClick(club)}
                        >
                          <div className="club-logo-wrapper">
                            <OverlayTrigger
                              placement="right"
                              overlay={
                                <Tooltip id="tooltip">{club.name}</Tooltip>
                              }
                            >
                              <Image
                                src={club.logo}
                                circle
                                responsive
                                className="nav-image mod-nav-image"
                              />
                            </OverlayTrigger>
                          </div>{" "}
                        </NavItem>
                      ))
                    : "There are no clubs available to join!"}
              </Modal.Body>
            </Tab>
            <Tab eventKey={3} title="Leave" className="joinLeaveClubsPane">
              <Modal.Body>
                <br />
                {this.state.loading
                  ? "Loading..."
                  : this.props.global.globalData.clubs.map(club => {
                      if (
                        club.id !== 12 &&
                        club.id !== this.props.local.localData.club.id
                      ) {
                        return (
                          <NavItem
                            key={club.id}
                            className="nav-item"
                            className={
                              this.state.leavableClubsClickMap[club.id]
                                ? "joinLeaveClubInd-selected"
                                : "joinLeaveClubInd"
                            }
                            onClick={() => this.handleLeaveClick(club)}
                          >
                            <div
                              className="club-logo-wrapper"
                              className="joinLeaveClubInd"
                            >
                              <OverlayTrigger
                                placement="right"
                                overlay={
                                  <Tooltip id="tooltip">{club.name}</Tooltip>
                                }
                              >
                                <Image
                                  src={club.logo}
                                  circle
                                  responsive
                                  className="nav-image mod-nav-image"
                                />
                              </OverlayTrigger>
                            </div>
                          </NavItem>
                        );
                      }
                    })}
              </Modal.Body>
            </Tab>
          </Tabs>
          <Modal.Footer>
            <Button
              onClick={e => this.handleClubAction(e)}
              value={this.state.selectedTab}
            >
              {this.state.selectedTab}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    global: state.global,
    local: state.local,
    currentLounge: state.currentLounge
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateLocalData: updateLocalData,
      addClub: addClub,
      fetchHomeData: fetchHomeData,
      updateCurrentLounge: updateCurrentLounge
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(ClubNav);
