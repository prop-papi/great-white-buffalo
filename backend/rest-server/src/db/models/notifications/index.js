const mysqldb = require("../../index.js").mysqldb;

const selectUsersNotifications = async user => {
  const query = `select Notifications.id, Notifications.owner_id, Notifications.partner_id, Users.username as partner_username, Users.picture as partner_picture, Notifications.type, Notifications.viewed, Notifications.bet_id, Bets.description, Notifications.created_at
    from Notifications
    inner join Users on Users.id=Notifications.partner_id
    inner join Bets on Bets.id=Notifications.bet_id
    where Notifications.owner_id='${user}'
    order by Notifications.created_at desc;;`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectUsersNotifications = selectUsersNotifications;
