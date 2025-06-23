const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
  flowername: String,
  habitat: String,
  binomialName: String,
  classification: String,
  flowername_kr: String,
});

module.exports = mongoose.model("Flower", flowerSchema, "flowers");
