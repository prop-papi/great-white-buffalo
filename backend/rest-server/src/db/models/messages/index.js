const Message = require("../../index.js").Message;
const moment = require("moment");

const insertNewMessage = async (user, lounge, createdAt, text, media) => {
  let date = new Date();
  let messageDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
  const object = {
    user,
    lounge,
    text,
    media,
    createdAt: createdAt || messageDate
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
    let data = await Message.find({ lounge: loungeID }).limit(50);
    return data;
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

module.exports.insertNewMessage = insertNewMessage;
module.exports.selectTop50Messages = selectTop50Messages;
