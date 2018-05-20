import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import "./VideoModal.css";
class VideoModal extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    console.log(this.props);
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
          <input placeholder={"Video URL"} value={this.props.link} />
        </Modal.Body>
        <Modal.Footer>
          <Button>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VideoModal;
