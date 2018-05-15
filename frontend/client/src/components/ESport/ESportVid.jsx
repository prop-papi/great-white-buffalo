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
    console.log("in did mount");
    const name = this.props.local.club.name;
    this.setState({ game: this.state.gamesList[name] });
    this.getStream(TWITCH_CLIENT_ID);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("nextProps here: ", nextProps);
    console.log("prevState here: ", prevState);
    const name = nextProps.local.club.name;
    if (prevState.gamesList[name] !== prevState.game) {
      return {
        game: prevState.gamesList[name]
      };
    }
    return null;
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate", prevProps);
    if (prevState.game !== this.state.game) {
      console.log("in if statement for component did update");
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

        //return response.data.streams[0].channel.name;
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    console.log("before if state render", this.state.streamer);
    if (this.state.streamer) {
      console.log("in if state streamer: ", this.state.streamer);
      return (
        <div align="center">
          {console.log("fdjsaklf;dsakl;", this.state.streamer)}
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
