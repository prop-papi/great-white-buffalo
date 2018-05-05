require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.js");
const path = require("path");
const passport = require("passport");
const PORT = process.env.PORT || 1337; // process.env.PORT || 1337;
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const db = require('./db/index.js');
import schema from './schema.js';
require('dotenv').config()

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  express.static(path.join(__dirname, "../../../frontend/client/public"))
);
app.use("/api", router);
app.use(express.static(path.join(__dirname, '../../../frontend/client/public')));
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
//app.use('/', router);
app.listen(1337, () =>
  console.log(
    `GraphiQL is now running on http://localhost:1337/graphiql`
  )
);

app.get("/*", function(req, res) {
  res.sendFile(
    path.join(__dirname, "../../../frontend/client/public/index.html"),
    function(err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// app.listen(PORT, () => {
//   console.log('Listening on port ' + PORT);
// });
