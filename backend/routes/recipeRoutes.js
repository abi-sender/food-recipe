const express = require("express");

const Recipe = require("../models/Recipe");

const router = express.Router();

router.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.json(recipe);
});

router.post("/", async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.json(recipe);
});

module.exports = router;