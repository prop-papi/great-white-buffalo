export const addMessage = (text, user, lounge) => dispatch => {
  dispatch({
    type: 'ADD_MESSAGE',
    text,
    user,
    lounge
  });
};

export const addUser = user => dispatch => {
  dispatch({
    type: 'ADD_USER',
    user
  });
};

export const messageReceived = (text, user) => dispatch => {
  dispatch({
    type: 'MESSAGE_RECEIVED',
    text,
    user
  });
};
