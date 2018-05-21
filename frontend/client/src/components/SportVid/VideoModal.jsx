import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import configs from "../../../../../config.js";
import axios from "axios";
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

  onChange(e) {
    this.setState({ link: e.target.value });
  }

  onSubmit() {
    let body = {
      link: this.state.link,
      id: this.props.id
    };
    //axios.post(`${configs.HOST}api/lounges/updateLink/`),;
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
          <Button>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VideoModal;
