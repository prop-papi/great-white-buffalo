import axios from "axios";

export const setLocalData = payload => {
  dispatch({ type: "LOCAL_DATA", payload });
};

export const setGlobalData = payload => {
  dispatch({ type: "GLOBAL_DATA", payload });
};

export const setDefaultData = (localData, globalData, dispatch) => {
  dispatch({ type: "SET_DEFAULT_DATA", localData, globalData });
};

export const fetchHomeData = (id, club) => async dispatch => {
  // utilize some kind of loading screen
  const globalData = await axios.get(`http://localhost:1337/api/users/${id}`);
  const localData = await axios.get(
    `http://localhost:1337/api/users/local/${club}`
  );
  setDefaultData(localData.data, globalData.data, dispatch);
};

export const updateLocalData = club => async dispatch => {
  const localData = await axios.get(
    `http://localhost:1337/api/users/local/${club}`
  );
  setLocalData(localData.data, dispatch);
};
