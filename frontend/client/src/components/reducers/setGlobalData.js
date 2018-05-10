export default function(state = {}, action) {
  switch (action.type) {
    case "GLOBAL_DATA":
      return Object.assign({}, state, {
        globalData: action.globalData
      });
      break;
    default:
      return state;
  }
}
