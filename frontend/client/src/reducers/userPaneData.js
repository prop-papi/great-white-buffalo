export default function(state = {}, action) {
  switch (action.type) {
    case "USER_PANE_DATA":
      return Object.assign({}, state, {
        userPaneData: action.userPaneData
      });
      break;
    default:
      return state;
  }
}
