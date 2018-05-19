const {
  getTop100UsersBy
} = require("../../../../rest-server/src/db/models/users/");
const redis = require("redis");
const client = require("../../../../redis-server/src/").client;

const getUsersBy = async columnName => {
  const data = await getTop100UsersBy(columnName);
  await client.set(columnName, JSON.stringify(data));
};

module.exports.getUsersBy = getUsersBy;
