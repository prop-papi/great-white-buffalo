const mysql = require("promise-mysql");
<<<<<<< dabafde5f6d5ff7e60221b9ece99933e11460f99
let _ = require("underscore");

const connection = mysql.createPool({
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  database: process.env.AWS_DATABASE
});

// example function for pulling global data
let test = async () => {
  let query1 = `select club from UsersClubs WHERE user=1;`;
  let data = await connection.query(query1);
  let clubs = [];
  _.each(data, function(row) {
    clubs.push(row.club);
  });
  let query2 = `select * from Clubs WHERE id in (${[...clubs]})`;
  let query3 = `select * from Bets WHERE club in (${[...clubs]})`;
  let data2 = await connection.query(query2);
  let data3 = await connection.query(query3);
  let global = {};
  global["clubs"] = JSON.parse(JSON.stringify(data2));
  global["bets"] = JSON.parse(JSON.stringify(data3));
  console.log(global);
};

let test2 = async () => {
  let query1 = `select * from Clubs WHERE id=4;`;
  let data = await connection.query(query1);
  let local = {};
  local["club"] = JSON.parse(JSON.stringify(data));
  let query2 = `select * from Lounges WHERE club=4;`;
  let data2 = await connection.query(query2);
  local["lounges"] = JSON.parse(JSON.stringify(data2));
  let query3 = `select * from Bets WHERE club=4;`;
  let data3 = await connection.query(query3);
  local["bets"] = JSON.parse(JSON.stringify(data3));
  console.log(local);
};

test2();
=======
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: "greatwhitebuffalo"
});

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Mysql Connected!");
//   // connection.query('select * from Users', (err, result) => {
//   //   if (err) {throw err;}
//   //   console.log('fuck yeah baby', result);
//   // })
// });
>>>>>>> Can now pull user data and all there bets

module.exports = connection;
