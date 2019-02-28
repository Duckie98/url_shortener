// Including some libraries
let express = require("express");
let mongo = require("mongodb");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let cors = require("cors");
let dns = require("dns");
let urlModel = require("./modules/UrlSchema");
let key = require("./config/key");

// -- Basic Configuration
let app = express();
// Set static path
app.use(express.static(__dirname + "/views"));
app.use(cors());
app.use(bodyParser());

// -- Connect to database
const mongo_key = key.mongoURL;
mongoose
  .connect(mongo_key)
  .then(() => console.log("Connected to DBS"))
  .catch(e => console.log(e));
let port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.render("index.html");
});

// POST request
// Add new url to the database
app.post("/api/shorturl/new", (req, res) => {
  let original = req.body.url;
  let urlRegex = /https:\/\/www.|http:\/\/www./g;
  dns.lookup(req.body.url.replace(urlRegex, ""), (err, addr, fami) => {
    if (err) {
      res.json({
        error: err
      });
    } else {
      urlModel.findOne({ url: original }, (err, link) => {
        if (link) {
          res.json({
            error: "URL already exist in the database"
          });
        } else {
          urlModel.count({}, (err, count) => {
            let newUrl = new urlModel({
              id: count,
              url: original
            });
            newUrl.save();
            res.json({
              original_url: original,
              short_url: count
            });
          });
        }
      });
    }
  });
});

// GET request
// Redirect the short link to the other page
app.get("/api/shorturl/:urlid", (req, res) => {
  urlModel.findOne({ id: req.params.urlid }, (err, url) => {
    if (err) {
      res.json({
        error: err
      });
    } else {
      res.redirect(url.url);
    }
  });
});

app.listen(port, () => {
  console.log("Server Working");
});
