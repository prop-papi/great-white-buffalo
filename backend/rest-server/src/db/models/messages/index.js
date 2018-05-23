const Message = require("../../index.js").Message;
const moment = require("moment");

const insertNewMessage = async (user, lounge, createdAt, text, media) => {
  const object = {
    user,
    lounge,
    text,
    media,
    createdAt
  };

  try {
    let data = await Message.create(object);
    console.log("Successfully inserted message.", data);
    return data;
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

const selectTop50Messages = async loungeID => {
  try {
    // query database for most recent 50 messages
    // sort by DESCENDING i.e. 1/1/2018 before 1/1/2017
    let data = await Message.find({ lounge: loungeID })
      .sort({ createdAt: -1 })
      .limit(50);
    // reverse order of data so that the oldest of the top 50 messages is at the front of the list
    return data.reverse();
  } catch (err) {
    console.log("error in SelectTop50Messages", err);
    throw new Error(err);
  }
};

module.exports.insertNewMessage = insertNewMessage;
module.exports.selectTop50Messages = selectTop50Messages;
