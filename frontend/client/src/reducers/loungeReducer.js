export default (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_CURRENT_LOUNGE":
      return Object.assign({}, state, {
        currentLounge: action.currentLounge
      });
      break;
    default:
      return state;
  }
};
