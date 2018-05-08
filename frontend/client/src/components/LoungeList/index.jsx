import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

  handleLoungeClick(lounge) {
    console.log(lounge);

    // display lounge data
  }

  render() {
    return (
      <div className="lounges-container">
        <Image
          src={this.props.data.localData.club[0].logo}
          circle
          responsive
          className="club-logo"
        />
        <ListGroup>
          {this.props.data.localData.lounges.map(lounge => {
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
    data: state.data
  };
}

export default connect(mapStateToProps)(LoungeList);
