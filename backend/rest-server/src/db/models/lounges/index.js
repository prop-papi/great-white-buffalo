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

const insertLounge = async (club, name, time) => {
  const query = `insert into Lounges (club, name, type, security, end_time) values ('${club}', '${name}', 'text', 'public', '${time}');`;
  try {
    return await mysqldb.query(query);
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

module.exports.selectAllLoungesInClub = selectAllLoungesInClub;
module.exports.checkLoungeExist = checkLoungeExist;
module.exports.insertLounge = insertLounge;
module.exports.selectLoungesForArchive = selectLoungesForArchive;
module.exports.archiveLounges = archiveLounges;
