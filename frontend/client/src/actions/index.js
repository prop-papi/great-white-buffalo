import axios from "axios";
import configs from "../../../../config.js";

export const setLocalData = (localData, dispatch) => {
  dispatch({ type: "LOCAL_DATA", localData });
};

export const setGlobalData = (globalData, dispatch) => {
  dispatch({ type: "GLOBAL_DATA", globalData });
};

export const setUserPaneData = (userPaneData, dispatch) => {
  return dispatch({ type: "USER_PANE_DATA", userPaneData });
};

export const setNotifications = (notificationsData, dispatch) => {
  dispatch({ type: "NOTIFICATIONS_DATA", notificationsData });
};

export const setMainComponent = component => dispatch => {
  dispatch({ type: "MAIN_COMPONENT_SELECTOR", component });
};

export const updateUserPaneData = userPaneData => dispatch => {
  dispatch({ type: "USER_PANE_DATA", userPaneData });
};

export const fetchHomeData = (id, club) => async dispatch => {
  // utilize some kind of loading screen
  try {
    const globalData = await axios.get(`${configs.HOST}api/users/${id}`);
    const localData = await axios.get(`${configs.HOST}api/users/local/${club}`);
    const notifications = await axios.get(
      `${configs.HOST}api/notifications/${id}`
    );
    setGlobalData(globalData.data, dispatch);
    setLocalData(localData.data, dispatch);
    setNotifications(notifications.data.notifications, dispatch);
    setUserPaneData({ showUsers: true, didSelectUser: false }, dispatch);
    setMainComponent("bets");
  } catch (err) {
    console.log(err);
    window.location.href = "http://localhost:1337/login";
  }
};

export const updateLocalData = club => async dispatch => {
  const localData = await axios.get(`${configs.HOST}api/users/local/${club}`);
  setLocalData(localData.data, dispatch);
};

export const updateNotifications = id => async dispatch => {
  const notifications = await axios.get(
    `${configs.HOST}api/notifications/${id}`
  );
  setNotifications(notifications.data.notifications, dispatch);
};

export const addLounge = (localData, newLounge) => async dispatch => {
  const l = {
    ...localData,
    lounges: [...localData.lounges, newLounge]
  };
  setLocalData(l, dispatch);
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

export const cancelMyBet = (globalData, bet, wager) => dispatch => {
  const newBets = globalData.bets.map((b, index) => {
    if (b.id !== bet.id) {
      return b;
    } else {
      return {
        ...b,
        status: "canceled"
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

export const acceptBet = (
  globalData,
  bet,
  wager,
  acceptorId,
  myId
) => dispatch => {
  const newBets = globalData.bets.map((b, index) => {
    if (b.id !== bet.id) {
      return b;
    } else {
      if (acceptorId === myId) {
        return {
          ...b,
          challenger: myId,
          challenger_name: localStorage.username,
          is_my_bet: 1,
          status: "active"
        };
      } else {
        if (Number(b.creator) === Number(myId)) {
          return {
            ...b,
            challenger: acceptorId,
            challenger_name: bet.challenger_name,
            is_my_bet: 1,
            status: "active"
          };
        } else {
          return {
            ...b,
            challenger: acceptorId,
            is_my_bet: 0,
            status: "active"
          };
        }
      }
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

export const voteOnBet = (
  globalData,
  bet,
  wager,
  vote,
  whoAmI, // myVote
  voterId,
  myId
) => dispatch => {
  // *** possibly add more in here later. KDR / wins / losses???? ***
  let iWon = false;
  const newBets = globalData.bets.map((b, index) => {
    if (b.id !== bet.id) {
      return b;
    } else {
      if (voterId === myId) {
        if (vote === 0) {
          return {
            ...b,
            status: "resolved"
          };
        } else {
          console.log("this is who i am ", whoAmI);
          if (whoAmI === "creator") {
            if (bet.challenger_vote === 1) {
              return {
                ...b,
                status: "disputed",
                creator_vote: 1
              };
            } else if (bet.challenger_vote === null) {
              return {
                ...b,
                creator_vote: 1
              };
            }
          } else if (whoAmI === "challenger") {
            if (bet.creator_vote === 1) {
              return {
                ...b,
                status: "disputed",
                challenger_vote: 1
              };
            } else if (bet.creator_vote === null) {
              return {
                ...b,
                challenger_vote: 1
              };
            }
          }
        }
      } else if (
        Number(myId) === Number(b.creator) ||
        Number(myId) === Number(b.challenger)
      ) {
        console.log("this is my bet and the other party has voted on it");
        if (vote === 0) {
          console.log(
            "this was my bet and the other party voted that they lost"
          );
          // this means I won the bet and need to update quite a bit of stuff....win numbers, win ratio, coins, etc. right now just coins being updated
          iWon = true;
          return {
            ...b,
            result: Number(myId),
            status: "resolved"
          };
        } else {
          // they voted that they won, check and see if i voted and handle accordingly
          console.log(
            "this was my bet and hte other party voted that they won"
          );
          if (Number(myId) === Number(b.creator)) {
            // they voted they won and I am the creator
            console.log("they voted win and im the creator");
            if (bet.creator_vote === 1) {
              console.log("we both voted win, disputed status");
              return {
                ...b,
                status: "disputed",
                challenger_vote: 1
              };
              // we both voted win, dispute and their vote change
            } else if (bet.creator_vote === null) {
              console.log("they voted win but i havent voted yet");
              // I haven't voted yet, just change their vote
              return {
                ...b,
                challenger_vote: 1
              };
            }
          } else if (Number(myId) === Number(bet.challenger)) {
            // they voted they won and I am the challenger
            if (bet.challenger_vote === 1) {
              // we both voted win, dispute and their vote change
              return {
                ...b,
                status: "disputed",
                creator_vote: 1
              };
            } else if (bet.challenger_vote === null) {
              // I haven't voted yet, just change their vote
              return {
                ...b,
                creator_vote: 1
              };
            }
          }
        }
      } else if (b.club_admin === Number(localStorage.id)) {
        if (vote) {
          // if its a 0, i don't care as I won't need to resolve a dispute
          if (whoAmI === "creator") {
            if (b.challenger_vote === 1) {
              return {
                ...b,
                status: "disputed",
                creator_vote: 1
              };
            } else {
              return {
                ...b,
                creator_vote: 1
              };
            }
          } else if (whoAmI === "challenger") {
            if (b.creator_vote === 1) {
              return {
                ...b,
                status: "disputed",
                challenger_vote: 1
              };
            } else {
              return {
                ...b,
                challenger_vote: 1
              };
            }
          }
        }
      } else {
        return b;
      }
    }
  });
  const newBalances =
    voterId === myId && vote === 0
      ? [
          {
            available_balance: globalData.balances[0].available_balance,
            escrow_balance: globalData.balances[0].escrow_balance - wager
          }
        ]
      : iWon
        ? [
            {
              available_balance:
                globalData.balances[0].available_balance + 2 * wager,
              escrow_balance: globalData.balances[0].escrow_balance - wager
            }
          ]
        : [
            {
              available_balance: globalData.balances[0].available_balance,
              escrow_balance: globalData.balances[0].escrow_balance
            }
          ];
  const g = {
    ...globalData,
    bets: newBets,
    balances: newBalances
  };
  setGlobalData(g, dispatch);
};

export const voting = (globalData, bet) => dispatch => {
  const newBets = globalData.bets.map((b, index) => {
    if (b.id !== bet.id) {
      return b;
    } else {
      return {
        ...b,
        status: "voting"
      };
    }
  });
  const g = {
    ...globalData,
    bets: newBets
  };
  setGlobalData(g, dispatch);
};

export const expired = (globalData, bet) => dispatch => {
  const newBets = globalData.bets.map((b, index) => {
    if (b.id !== bet.id) {
      return b;
    } else {
      return {
        ...b,
        status: "expired"
      };
    }
  });

  const newBalances =
    Number(localStorage.id) === bet.creator
      ? [
          {
            available_balance:
              globalData.balances[0].available_balance + bet.wager,
            escrow_balance: globalData.balances[0].escrow_balance - bet.wager
          }
        ]
      : [
          {
            available_balance: globalData.balances[0].available_balance,
            escrow_balance: globalData.balances[0].escrow_balance
          }
        ];
  const g = {
    ...globalData,
    bets: newBets,
    balances: newBalances
  };
  setGlobalData(g, dispatch);
};

export const externalResolved = (
  globalData,
  bet,
  vote // 0 -> creator won, 1 -> challenger won, 2 -> stalemate
) => dispatch => {
  // *** possibly add more in here later. KDR / wins / losses???? ***
  let iWon;
  const newBets = globalData.bets.map((b, index) => {
    if (b.id !== bet.id) {
      return b;
    } else {
      if (
        b.creator !== Number(localStorage.id) &&
        b.challenger !== Number(localStorage.id)
      ) {
        if (bet.club_admin === Number(localStorage.id)) {
          if (vote === 2) {
            return {
              ...b,
              status: "stalemate"
            };
          } else {
            return {
              ...b,
              status: "resolved"
            };
          }
        } else {
          return b;
        }
      } else {
        if (vote === 2) {
          iWon = "stalemate";
          return {
            ...b,
            status: "stalemate"
          };
        } else if (vote === 0) {
          if (b.creator === Number(localStorage.id)) {
            // creator won and I am the creator
            console.log("admin says i, the creator, won");
            iWon = "yes";
            return {
              ...b,
              status: "resolved",
              result: b.creator,
              challenger_vote: 0
            };
          } else {
            // creator won and I am the challenger
            iWon = "no";
            return {
              ...b,
              status: "resolved",
              result: b.creator,
              challenger_vote: 0
            };
          }
        } else if (vote === 1) {
          if (b.creator === Number(localStorage.id)) {
            // challenger won and I am the creator
            iWon = "no";
            return {
              ...b,
              status: "resolved",
              result: b.challenger,
              creator_vote: 0
            };
          } else {
            // challenger won and I am the challenger
            iWon = "yes";
            return {
              ...b,
              status: "resolved",
              result: b.challenger,
              creator_vote: 0
            };
          }
        }
      }
    }
  });
  const newBalances =
    bet.creator !== Number(localStorage.id) &&
    bet.challenger !== Number(localStorage.id)
      ? [
          {
            available_balance: globalData.balances[0].available_balance,
            escrow_balance: globalData.balances[0].escrow_balance
          }
        ]
      : iWon === "stalemate"
        ? [
            {
              available_balance:
                globalData.balances[0].available_balance + bet.wager,
              escrow_balance: globalData.balances[0].escrow_balance - bet.wager
            }
          ]
        : iWon === "yes"
          ? [
              {
                available_balance:
                  globalData.balances[0].available_balance + 2 * bet.wager,
                escrow_balance:
                  globalData.balances[0].escrow_balance - bet.wager
              }
            ]
          : [
              {
                available_balance: globalData.balances[0].available_balance,
                escrow_balance:
                  globalData.balances[0].escrow_balance - bet.wager
              }
            ];
  const g = {
    ...globalData,
    bets: newBets,
    balances: newBalances
  };
  setGlobalData(g, dispatch);
};

export const addBet = (globalData, newBet) => dispatch => {
  const g = {
    ...globalData,
    bets: [...globalData.bets, newBet]
  };
  setGlobalData(g, dispatch);
};

export const addClub = (globalData, newClub) => dispatch => {
  const g = {
    ...globalData,
    clubs: [...globalData.clubs, newClub]
  };
  setGlobalData(g, dispatch);
};
