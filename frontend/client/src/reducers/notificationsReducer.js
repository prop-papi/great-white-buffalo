export default function(state = {}, action) {
  switch (action.type) {
    case "NOTIFICATIONS_DATA":
      return Object.assign({}, state, {
        notificationsData: action.notificationsData
      });
      break;
    default:
      return state;
  }
}
