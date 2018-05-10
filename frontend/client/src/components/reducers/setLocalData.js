export default function(state = {}, action) {
  switch (action.type) {
    case "LOCAL_DATA":
      return Object.assign({}, state, {
        localData: action.localData
      });
      break;
    default:
      return state;
  }
}
