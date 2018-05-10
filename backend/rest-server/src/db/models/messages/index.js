const Message = require("../../index.js").Message;
const moment = require("moment");

const insertNewMessage = async (user, lounge, text, media) => {
  let date = new Date();
  let messageDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
  const object = {
    user,
    lounge,
    text,
    media,
    created_at: messageDate
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

const selectTop50Messages = async () => {
  try {
    let data = await Message.find({}).limit(50);
    return data;
  } catch (err) {
    console.log("error", err);
    throw new Error(err);
  }
};

module.exports.insertNewMessage = insertNewMessage;
module.exports.selectTop50Messages = selectTop50Messages;
