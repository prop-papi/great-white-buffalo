export const message = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'MESSAGE_RECEIVED':
      return Object.assign({}, state, {
        text: action.text,
        user: action.user
      });
      break;
    default:
      return state;
  }
};
