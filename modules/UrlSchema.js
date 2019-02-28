let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UrlSchema = new Schema({
  id: Number,
  url: String
});

let urlModel = mongoose.model("url", UrlSchema);

module.exports = urlModel;
