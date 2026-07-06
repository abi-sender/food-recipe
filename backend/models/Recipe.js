const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  category: String,
  image: String,
  description: String,
  time: String,
  rating: String,
});

module.exports = mongoose.model("Recipe", recipeSchema);