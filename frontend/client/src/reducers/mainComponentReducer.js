export default function(state = {}, action) {
  switch (action.type) {
    case "MAIN_COMPONENT_SELECTOR":
      return Object.assign({}, state, {
        component: action.component
      });
      break;
    default:
      return state;
  }
}
