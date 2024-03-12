const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js')
const usersontrollers = require("../controllers/users.js")


//  /signup routes
router.route("/signup")
.get(usersontrollers.renderSignupForm)
.post(wrapAsync(usersontrollers.signup));

//  /login routes
router.route("/login")
.get(usersontrollers.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),usersontrollers.login)
           
//  loguot route
router.get('/logout',usersontrollers.logout)

module.exports=router;