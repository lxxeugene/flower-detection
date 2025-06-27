// models/Collection.js
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
  memo: { type: String },
  date: { type: String }, // YYYY-MM-DD
  imageBase64: { type: String }, // base64 인코딩 이미지
});

module.exports = mongoose.model("Collection", collectionSchema);
