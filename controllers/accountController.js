/* ****************************************
*  Deliver login view
* *************************************** */
const utilities = require('../utilities');
const accountModel = require('../models/account-model');

async function buildLogin (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {title: "Login", nav});
    // req.flash("notice", "This is a flash message.");
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegistration (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/registration", {title: "New User Registration", nav});
    // req.flash("notice", "This is a flash message.")
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerNewAccount(req, res, next) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
    console.error(regResult);
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            title: "Registration",
            nav,
        })
    }
}


module.exports = {buildLogin, buildRegistration, registerNewAccount}