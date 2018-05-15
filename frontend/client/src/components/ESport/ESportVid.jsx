import React, { Component } from "react";
import axios from "axios";
import { ResponsiveEmbed, Embed } from "react-bootstrap";
import { TWITCH_CLIENT_ID } from "../../../../../config.js";

class ESportVid extends Component {
  constructor() {
    super();
    this.state = {
      streamer: ""
    };
  }

  componentDidMount() {
    this.getStream(TWITCH_CLIENT_ID);
  }

  getStream(clientID) {
    axios
      .get("https://api.twitch.tv/kraken/streams/?game=fortnite&limit=1", {
        headers: {
          "Client-ID": clientID
        }
      })
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
        <div align="center" id="twitch">
          <ResponsiveEmbed a4by3>
            <embed
              src={`http://player.twitch.tv/?channel=${this.state.streamer}`}
            />
          </ResponsiveEmbed>
        </div>
      );
    }
    return <div />;
  }
}

export default ESportVid;
