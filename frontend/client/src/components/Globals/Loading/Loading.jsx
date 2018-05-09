import React, { Component } from "react";
import { Jumbotron, Image } from "react-bootstrap";
import "./Loading.css";

class Loading extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="loading-wrapper">
        <Image
          className="loading-image"
          src="https://s3.us-east-2.amazonaws.com/great-white-buffalo/loading.gif"
          responsive
        />
        <h2 className="loading-text">Fetching Data...</h2>
      </div>
    );
  }
}

export default Loading;
