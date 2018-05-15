const mysqldb = require("../../index.js").mysqldb;

const selectUsersNotifications = async user => {
  const query = `select Notifications.id, Notifications.owner_id, Notifications.partner_id, Users.username as partner_username, Users.picture as partner_picture, Notifications.type, Notifications.viewed, Notifications.bet_id, Bets.description, Notifications.created_at
    from Notifications
    inner join Users on Users.id=Notifications.partner_id
    inner join Bets on Bets.id=Notifications.bet_id
    where Notifications.owner_id='${user}' and Notifications.viewed=0
    order by Notifications.created_at desc;`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const sendFriendRequestNotification = async (user, partner) => {
  const query = `INSERT INTO Notifications (owner_id, partner_id, type) VALUES ('${user}', '${partner}', 2);`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const friendRequestResponseNotification = async (user, partner, type) => {
  const query = `INSERT INTO Notifications (owner_id, partner_id, type) VALUES ('${user}', '${partner}', '${type}');`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const notificationViewed = async id => {
  const query = `UPDATE Notifications SET viewed=1 WHERE id=${id}`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.sendFriendRequestNotification = sendFriendRequestNotification;
module.exports.selectUsersNotifications = selectUsersNotifications;
module.exports.friendRequestResponseNotification = friendRequestResponseNotification;
module.exports.notificationViewed = notificationViewed;
