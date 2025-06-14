const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const router = express.Router();
const passport = require("passport");
const {saveRedirectUrl}= require("../middleware.js") 
const userController = require("../controllers/users.js")


router.get("/signup", userController.signupform);
router.post( "/signup",wrapAsync(userController.signup));

router.get("/login", userController.loginform);
router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.userlogin
);

router.get("/logout", userController.logout);
module.exports = router;
