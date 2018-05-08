import axios from "axios";

export const setLocalData = payload => dispatch => {
  dispatch({ type: "LOCAL_DATA", payload });
};

export const setGlobalData = payload => dispatch => {
  dispatch({ type: "GLOBAL_DATA", payload });
};

export const setTestData = (localData, globalData) => dispatch => {
  dispatch({ type: "SET_TEST_DATA", localData, globalData });
};

export const fetchHomeData = async id => {
  // make axios request w/ user id to fetch all data needed
  // set the store data with results
  // utilize some kind of loading screen
  const data = await axios.get(`http://localhost:1337/api/users/${id}`);
};
