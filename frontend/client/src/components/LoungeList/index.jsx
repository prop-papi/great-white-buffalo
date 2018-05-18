import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { bindActionCreators } from "redux";
import { updateCurrentLounge } from "../../actions/loungeActions.js";
import { addLounge } from "../../actions/index.js";

import {
  ListGroup,
  ListGroupItem,
  ListGroupItemProps,
  Image,
  Modal,
  MenuItem,
  ButtonToolbar,
  DropdownButton,
  Button
} from "react-bootstrap";

import "./index.css";

class LoungeList extends Component {
  constructor() {
    super();

    this.state = {
      show: false,
      security: "Public",
      loungeName: "",
      videoLink: ""
    };

    this.handleLoungeClick = this.handleLoungeClick.bind(this);
    this.createNewLounge = this.createNewLounge.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.selectSecurity = this.selectSecurity.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleLoungeClick(lounge) {
    console.log("HERE IS THE LOUNGE", lounge);
    await this.props.updateCurrentLounge(lounge);
    // display lounge data
  }

  async createNewLounge() {
    // do work here
    const body = {
      club: this.props.local.localData.club.id,
      name: this.state.loungeName,
      time: null,
      security: this.state.security.toLowerCase(),
      adminId: localStorage.id,
      videoLink: this.state.videoLink
    };
    try {
      const data = await axios.post(
        `http://localhost:1337/api/lounges/insertlounge`,
        body
      );
      if (data.status === 200) {
        const newLounge = data.data;
        console.log(newLounge);
        this.props.addLounge(this.props.local.localData, newLounge);
        if (newLounge.security === "public") {
          const payload = {
            lounge: newLounge,
            action: "newLounge"
          };
          console.log("payload", payload);
          this.props.betSocket.emit("bet", payload);
        }
        this.setState({ show: false, loungeName: "", videoLink: "" });
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
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.local.localData.lounges[0] !==
      newProps.local.localData.lounges[0]
    ) {
      this.props.updateCurrentLounge(this.props.local.localData.lounges[0]);
    }
  }

  async componentDidMount() {
    await this.props.updateCurrentLounge(this.props.local.localData.lounges[0]);
  }

  render() {
    return (
      <div className="lounges-container">
        <Image
          src={this.props.local.localData.club.logo}
          circle
          responsive
          className="club-logo"
        />
        <ListGroup>
          {this.props.local.localData.lounges.map(lounge => {
            return (
              <ListGroupItem
                className="lounge-item"
                key={lounge.id}
                onClick={() => this.handleLoungeClick(lounge)}
                selected
              >
                <span className="lounge-name">
                  <i className="fa">&#xf064; </i> {lounge.name}
                </span>
              </ListGroupItem>
            );
          })}
          <ListGroupItem
            className="lounge-item"
            onClick={this.handleShow}
            selected
          >
            <span className="lounge-name">
              <i className="fa">&#x2b; </i> Join or Create a Lounge
            </span>
          </ListGroupItem>
        </ListGroup>

        <Modal show={this.state.show} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>
              Create a Lounge in {this.props.local.localData.club.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Lounge name:{" "}
            <input
              type="text"
              name="loungeName"
              style={{ width: 100 }}
              value={this.state.loungeName}
              onChange={this.handleChange}
            />{" "}
            <br />
            Video Link:{" "}
            <input
              type="text"
              name="videoLink"
              style={{ width: 100 }}
              value={this.state.videoLink}
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
            <Button onClick={this.createNewLounge}>Create Lounge</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    local: state.local,
    currentLounge: state.currentLounge
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateCurrentLounge: updateCurrentLounge,
      addLounge: addLounge
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(LoungeList);
