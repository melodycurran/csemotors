//Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const serverValidate = require('../utilities/account-validation');


router.post("/registration", serverValidate.registrationRules(), serverValidate.checkRegData, utilities.handleErrors(accountController.registerNewAccount));
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
// Process the login attempt
router.post("/login", serverValidate.loginRules(), serverValidate.checkLogin,
    utilities.handleErrors(accountController.processLogin)); 
// router.post("/login", utilities.handleErrors(accountController.processLogin));
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Account management route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLoginManagement));



module.exports = router;