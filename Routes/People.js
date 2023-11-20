const express = require("express");
const { IsUserAuthenticated } = require("../Controllers/AuthController");
const router = express.Router();
const { GetRecommendedAccounts } = require("../Controllers/PeopleController");

router.use(IsUserAuthenticated);
router.get("/getrecommendedaccounts", GetRecommendedAccounts);

module.exports = router;
