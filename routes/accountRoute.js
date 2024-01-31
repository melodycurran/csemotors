//Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/registration", utilities.handleErrors(accountController.registerNewAccount));
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));



module.exports = router;