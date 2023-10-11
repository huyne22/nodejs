const express = require("express");
const router1 = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
router1.get("/", (req, res) => {
  res.send("huy1");
});

module.exports = {
  router1,
};
