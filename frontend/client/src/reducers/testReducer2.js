export default function(state = {}, action) {
  switch (action.type) {
    case 'THIS_IS_ALSO_A_TEST':
      console.log(action)
      return Object.assign({}, state, {
        searchNumber: action.searchNumber
    });
    break;
    default:
      return state;
  }
}


