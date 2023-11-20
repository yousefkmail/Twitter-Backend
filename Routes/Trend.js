const express = require("express");
const { GetTrends } = require("../Controllers/TrendController");
const router = express.Router();

router.get("/get", GetTrends);

module.exports = router;
