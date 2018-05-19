const mysqldb = require("../../index.js").mysqldb;
const SqlString = require("sqlstring");

const selectAllLoungesInClub = async club => {
  const query = `select * from Lounges WHERE club=${club} AND is_archived=0;`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const checkLoungeExist = async name => {
  const query = `select * from Lounges WHERE name=${SqlString.escape(name)};`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const insertLounge = async (club, name, time, security, adminId, videoLink) => {
  const query = `insert into Lounges (club, name, type, security, end_time, admin_id, video_link) values ('${club}', ${SqlString.escape(
    name
  )}, 'text', '${security}', '${time}', '${adminId}', '${videoLink}');`;
  try {
    let data = await mysqldb.query(query);
    const insertedQuery = `SELECT * FROM Lounges WHERE Lounges.id=${
      data.insertId
    };`;
    try {
      return await mysqldb.query(insertedQuery);
    } catch (err) {
      console.log("error", err);
      return err;
    }
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const selectLoungesForArchive = async () => {
  const query = `select id, end_time from Lounges where end_time!='null' and is_archived=0;`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const archiveLounges = async ids => {
  const query = `update Lounges set is_archived=1 where id in (${[...ids]})`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

const getAllLounges = async () => {
  const query = `SELECT id FROM Lounges WHERE is_archived=0`;
  try {
    return await mysqldb.query(query);
  } catch (err) {
    console.log("error", err);
    return err;
  }
};

module.exports.selectAllLoungesInClub = selectAllLoungesInClub;
module.exports.checkLoungeExist = checkLoungeExist;
module.exports.insertLounge = insertLounge;
module.exports.selectLoungesForArchive = selectLoungesForArchive;
module.exports.archiveLounges = archiveLounges;
module.exports.getAllLounges = getAllLounges;
