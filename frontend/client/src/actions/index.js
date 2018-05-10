import axios from "axios";

export const setLocalData = (localData, dispatch) => {
  dispatch({ type: "LOCAL_DATA", localData });
};

export const setGlobalData = (globalData, dispatch) => {
  dispatch({ type: "GLOBAL_DATA", globalData });
};

export const setUserPaneData = (userPaneData, dispatch) => {
  return dispatch({ type: "USER_PANE_DATA", userPaneData });
};

export const fetchHomeData = (id, club) => async dispatch => {
  // utilize some kind of loading screen
  const globalData = await axios.get(`http://localhost:1337/api/users/${id}`);
  const localData = await axios.get(
    `http://localhost:1337/api/users/local/${club}`
  );
  setGlobalData(globalData.data, dispatch);
  setLocalData(localData.data, dispatch);
  setUserPaneData({ showUsers: true, didSelectUser: false }, dispatch);
};

export const updateLocalData = club => async dispatch => {
  const localData = await axios.get(
    `http://localhost:1337/api/users/local/${club}`
  );
  setLocalData(localData.data, dispatch);
};

export const updateBalances = (
  globalData,
  wager,
  boolIsCreatingOrAcceptingBet
) => dispatch => {
  const newBalances = [
    // this needs modularization!!!!!!!
    {
      available_balance: boolIsCreatingOrAcceptingBet
        ? globalData.balances[0].available_balance - wager
        : globalData.balances[0].available_balance + wager,
      escrow_balance: boolIsCreatingOrAcceptingBet
        ? globalData.balances[0].escrow_balance + wager
        : globalData.balances[0].escrow_balance - wager
    }
  ];
  const g = {
    ...globalData,
    balances: newBalances
  };
  setGlobalData(g, dispatch);
};

export const cancelMyBet = (globalData, betId, wager) => dispatch => {
  const newBets = globalData.bets.map((bet, index) => {
    if (bet.id !== betId) {
      return bet;
    } else {
      return {
        ...bet,
        status: "closed"
      };
    }
  });
  const newBalances = [
    {
      available_balance: globalData.balances[0].available_balance + wager,
      escrow_balance: globalData.balances[0].escrow_balance - wager
    }
  ];
  const g = {
    ...globalData,
    bets: newBets,
    balances: newBalances
  };
  setGlobalData(g, dispatch);
};

export const acceptBet = (globalData, betId, wager, myId) => dispatch => {
  const newBets = globalData.bets.map((bet, index) => {
    if (bet.id !== betId) {
      return bet;
    } else {
      return {
        ...bet,
        challenger: myId,
        is_my_bet: 1
      };
    }
  });
  const newBalances = [
    {
      available_balance: globalData.balances[0].available_balance - wager,
      escrow_balance: globalData.balances[0].escrow_balance + wager
    }
  ];
  const g = {
    ...globalData,
    bets: newBets,
    balances: newBalances
  };
  setGlobalData(g, dispatch);
};
