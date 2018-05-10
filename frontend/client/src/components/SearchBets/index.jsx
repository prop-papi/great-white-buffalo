import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateBalances } from "../../actions";
import Bet from "../Bet/index.jsx";
import "./index.css";
import {
  ButtonToolbar,
  DropdownButton,
  FormControl,
  OverlayTrigger,
  Input,
  Tooltip,
  Button,
  Form,
  MenuItem,
  Panel,
  PanelGroup,
  Col,
  ControlLabel,
  Alert
} from "react-bootstrap";

class SearchBets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      myOpenBets: [],
      myCurrentBets: [],
      openBets: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.tooltips = [
      // will i need this?
      <Tooltip id="tooltip">IF I NEED A TOOLTIP IN HERE</Tooltip>
    ];
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    var tempMyOpen = [];
    var tempMyCurrent = [];
    var tempOpen = [];
    newProps.global.globalData.bets.forEach(b => {
      if (b.status === "pending") {
        if (b.is_my_bet) {
          if (b.challenger === null) {
            tempMyOpen.push(b);
          } else {
            tempMyCurrent.push(b);
          }
        } else if (b.challenger === null) {
          if (
            newProps.local.localData.club.name === "Global" ||
            newProps.local.localData.club.id === b.club
          ) {
            tempOpen.push(b);
          }
        }
      }
    });
    this.setState({
      myOpenBets: tempMyOpen,
      myCurrentBets: tempMyCurrent,
      openBets: tempOpen
    });
  }

  handleChange(e) {
    this.setState({ searchValue: e.target.value }); //  this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="searchBox">
        <input
          type="text"
          placeholder="this currently does nothing"
          value={this.state.searchValue}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
        <br /> <br />
        <div className="searchResults">
          <PanelGroup accordion id="accordion" defaultActiveKey="3">
            <Panel eventKey="1">
              <Panel.Heading>
                <Panel.Title toggle>
                  My Open Wagers ({this.state.myOpenBets.length})
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {this.state.myOpenBets.map(b => <Bet key={b.id} bet={b} />)}
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title toggle>
                  My Active Wagers ({this.state.myCurrentBets.length})
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {this.state.myCurrentBets.map(b => <Bet key={b.id} bet={b} />)}
              </Panel.Body>
            </Panel>
            <Panel eventKey="3">
              <Panel.Heading>
                <Panel.Title toggle>
                  Available {this.props.local.localData.club.name} Wagers ({
                    this.state.openBets.length
                  })
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {this.state.openBets.map(b => <Bet key={b.id} bet={b} />)}
              </Panel.Body>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // specifies the slice of state this compnent wants and provides it
  return {
    global: state.global,
    local: state.local
  };
}

function bindActionsToDispatch(dispatch) {
  return bindActionCreators(
    {
      updateBalances: updateBalances
    },
    dispatch
  );
}

export default connect(mapStateToProps, bindActionsToDispatch)(SearchBets);
