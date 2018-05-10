export const updateCurrentLounge = currentLounge => dispatch => {
  dispatch({
    type: "UPDATE_CURRENT_LOUNGE",
    currentLounge
  });
};
