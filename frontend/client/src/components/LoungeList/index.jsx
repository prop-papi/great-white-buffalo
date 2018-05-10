import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateCurrentLounge } from "../../actions/loungeActions.js";

import {
  ListGroup,
  ListGroupItem,
  ListGroupItemProps,
  Image
} from "react-bootstrap";

import "./index.css";

class LoungeList extends Component {
  constructor() {
    super();

    this.handleLoungeClick = this.handleLoungeClick.bind(this);
  }

  async handleLoungeClick(lounge) {
    await this.props.updateCurrentLounge(lounge);
    // display lounge data
  }

  // async componentDidMount() {
  //   await this.props.updateCurrentLounge(this.props.local.localData.lounges[0]);
  // }

  render() {
    console.log(this.props.local);
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
        </ListGroup>
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
      updateCurrentLounge: updateCurrentLounge
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(LoungeList);
