export const THIS_IS_A_TEST = "THIS_IS_A_TEST"; // you can either declare as a variable

export const testAction = createNumber => dispatch => {
  dispatch({ type: THIS_IS_A_TEST, createNumber });
};

export const testSearchAction = searchNumber => dispatch => {
  dispatch({ type: "THIS_IS_ALSO_A_TEST", searchNumber });
};

export const setTestData = (localData, globalData) => dispatch => {
  dispatch({ type: "SET_TEST_DATA", localData, globalData });
};
