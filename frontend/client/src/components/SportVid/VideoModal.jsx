import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import configs from "../../../../../config.js";
import axios from "axios";
import { updateCurrentLounge } from "../../actions/loungeActions";

import "./VideoModal.css";
class VideoModal extends Component {
  constructor() {
    super();
    this.state = {
      link: ""
    };
  }

  componentDidMount() {
    this.setState({ link: this.props.link });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.link !== prevState.link ? { link: nextProps.link } : null;
  }

  onChange(e) {
    this.setState({ link: e.target.value });
  }

  checkIfYoutube(str) {
    return str.includes("youtube") && str.includes("watch?v=");
  }

  onSubmit() {
    let link = this.checkIfYoutube(this.state.link)
      ? this.state.link.replace("watch?v=", "embed/")
      : this.state.link;
    let body = {
      link,
      id: this.props.id
    };
    axios
      .post(`${configs.HOST}api/lounges/updateLink/`, body)
      .then(response => {
        console.log("successful update");
        let newLounge = Object.assign(
          {},
          this.props.currentLounge.currentLounge
        );
        newLounge.video_link = link;
        this.props.updateCurrentLounge(newLounge);
        this.props.setShow();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={() => this.props.setShow()}
        className="video"
      >
        <Modal.Header>
          <Modal.Title>Edit Video Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            placeholder={"Video URL"}
            value={this.state.link}
            className="link-input"
            onChange={e => this.onChange(e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.onSubmit()}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentLounge: state.currentLounge
  };
};

const bindActionsToDispatch = dispatch => {
  return bindActionCreators(
    {
      updateCurrentLounge: updateCurrentLounge
    },
    dispatch
  );
};

export default connect(mapStateToProps, bindActionsToDispatch)(VideoModal);
