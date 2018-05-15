import React, { Component } from "react";
import axios from "axios";
import { ResponsiveEmbed } from "react-bootstrap";
import { TWITCH_CLIENT_ID } from "../../../../../config.js";
import { connect } from "react-redux";

class ESportVid extends Component {
  constructor() {
    super();
    this.state = {
      streamer: "",
      game: "",
      gamesList: {
        Fortnite: "fortnite",
        Overwatch: "overwatch",
        "Rocket League": "Rocket League",
        PUBG: "playerunknown's battlegrounds"
      }
    };
  }

  componentDidMount() {
    const name = this.props.local.club.name;
    this.setState({ game: this.state.gamesList[name] });
    this.getStream(TWITCH_CLIENT_ID);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const name = nextProps.local.club.name;
    return prevState.gamesList[name] !== prevState.game
      ? { game: prevState.gamesList[name] }
      : null;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.game !== this.state.game) {
      await this.getStream(TWITCH_CLIENT_ID);
    }
  }

  async getStream(clientID) {
    await axios
      .get(
        `https://api.twitch.tv/kraken/streams/?game=${
          this.state.gamesList[this.props.local.club.name]
        }&limit=1`,
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
        <div align="center">
          <ResponsiveEmbed a4by3>
            <iframe
              src={`http://player.twitch.tv/?channel=${this.state.streamer}`}
            />
          </ResponsiveEmbed>
        </div>
      );
    }
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    local: state.local.localData
  };
};

export default connect(mapStateToProps)(ESportVid);
