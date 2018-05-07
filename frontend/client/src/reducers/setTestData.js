export default function(state = {}, action) {
  switch (action.type) {
    case 'SET_TEST_DATA':
      return Object.assign({}, state, {
        localData: action.localData,
        globalData: action.globalData
      });
      break;
    default:
      return state;
  }
}
