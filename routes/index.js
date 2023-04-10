const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { renderLogin, createDomain } = require("../controllers");
const router = express.Router();

router.get("/", renderLogin);
router.post("/domain", isLoggedIn, createDomain);

module.exports = router;
