export default function(state = {}, action) {
  switch (action.type) {
    case 'THIS_IS_A_TEST':
      return Object.assign({}, state, {
        createNumber: action.createNumber
      });
      break;
    default:
      return state;
  }
}
