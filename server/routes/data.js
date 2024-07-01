const express = require("express");
const Router = express.Router();
const Data = require("../models/Data");

Router.get("/", async (req, res) => {
  try {
    console.log("inside find all")
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = Router;
