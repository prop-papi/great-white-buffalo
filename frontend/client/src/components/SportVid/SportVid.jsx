import React, { Component } from "react";
import axios from "axios";
import { ResponsiveEmbed } from "react-bootstrap";
import { TWITCH_CLIENT_ID } from "../../../../../config.js";
import { connect } from "react-redux";
import "./SportVid.css";

class SportVid extends Component {
  constructor() {
    super();
    this.state = {
      streamer: "",
      game: "",
      videoLink: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentLounge.currentLounge.name === "General") {
      const name =
        nextProps.local.club.name === "PUBG"
          ? "playerunknown's battlegrounds"
          : nextProps.local.club.name;
      console.log("YO YO", name !== prevState.game);
      return name !== prevState.game
        ? { game: name }
        : { videoLink: "", streamer: "" };
    } else {
      let videoLink = nextProps.currentLounge.currentLounge.video_link;
      console.log("Get derived state", videoLink);
      return {
        videoLink,
        streamer: ""
      };
    }
  }

  async componentDidMount() {
    if (this.props.currentLounge.currentLounge.name === "General") {
      const name =
        this.props.local.club.name === "PUBG"
          ? "playerunknown's battlegrounds"
          : this.props.local.club.name;
      this.setState({ game: name });
      await this.getStream(TWITCH_CLIENT_ID);
    } else if (this.props.currentLounge.currentLounge.video_link) {
      let videoLink = this.props.currentLounge.currentLounge.video_link;
      this.setState({ videoLink });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const currLounge = this.props.currentLounge.currentLounge.name;
    if (prevState.game !== this.state.game && currLounge === "General") {
      await this.getStream(TWITCH_CLIENT_ID);
    }
  }

  getStream(clientID) {
    axios
      .get(
        `https://api.twitch.tv/kraken/streams/?game=${this.state.game}&limit=1`,
        {
          headers: {
            "Client-ID": clientID
          }
        }
      )
      .then(response => {
        this.setState({ streamer: response.data.streams[0].channel.name });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.streamer) {
      return (
        <div className="videoContainer">
          <iframe
            src={`https://player.twitch.tv/?channel=${this.state.streamer}`}
            allowFullScreen={true}
            className="videoFrame"
          />
        </div>
      );
    } else if (this.state.videoLink) {
      return (
        <div className="videoContainer">
          <iframe
            src={this.state.videoLink}
            allowFullScreen={true}
            sandbox="allow-scripts allow-forms allow-same-origin"
            className="videoFrame"
          />
        </div>
      );
    }
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    local: state.local.localData,
    currentLounge: state.currentLounge
  };
};

export default connect(mapStateToProps)(SportVid);
