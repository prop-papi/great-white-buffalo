require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.js");
const https = require("https");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const PORT = process.env.PORT || 1337; // process.env.PORT || 1337;
const _ = require("underscore");
const mongo = require("./db/models/messages/index");

const app = express();

// const options = {
//   cert: fs.readFileSync(path.join(__dirname, "../../../fullchain.pem")),
//   key: fs.readFileSync(path.join(__dirname, "../../../privkey.pem"))
// };

// const corsOptions = {
//   origin: "https://gwbuff.com",
//   credentials: true
// };

app.use(cors());

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  express.static(path.join(__dirname, "../../../frontend/client/public"))
);

app.get("*.js", function(req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

app.use("/api", router);

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

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

// https.createServer(options, app).listen(1443);
