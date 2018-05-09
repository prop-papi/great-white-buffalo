import axios from "axios";

export const setLocalData = (localData, dispatch) => {
  dispatch({ type: "LOCAL_DATA", localData });
};

export const setGlobalData = (globalData, dispatch) => {
  dispatch({ type: "GLOBAL_DATA", globalData });
};

export const fetchHomeData = (id, club) => async dispatch => {
  // utilize some kind of loading screen
  const globalData = await axios.get(`http://localhost:1337/api/users/${id}`);
  const localData = await axios.get(
    `http://localhost:1337/api/users/local/${club}`
  );
  setGlobalData(globalData.data, dispatch);
  setLocalData(localData.data, dispatch);
};

export const updateLocalData = club => async dispatch => {
  const localData = await axios.get(
    `http://localhost:1337/api/users/local/${club}`
  );
  setLocalData(localData.data, dispatch);
};

export const updateBalances = (globalData, wager) => dispatch => {
  const g = {
    ...globalData,
    balances: {
      ...globalData.balances,
      [0]: {
        ...globalData.balances[0],
        available_balance: globalData.balances[0].available_balance - wager,
        escrow_balance: globalData.balances[0].escrow_balance + wager
      }
    }
  };
  setGlobalData(g, dispatch);
};
