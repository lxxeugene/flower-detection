const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  flower: {
    flowername: String,
    flowername_kr: String,
    habitat: String,
    binomialName: String,
    classification: String,
  },
  image: String, // base64
  date: Date,
  memo: String,
});

module.exports = mongoose.model("Collection", collectionSchema);
