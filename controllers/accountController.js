const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {title: "Login", nav, errors: null});
    // req.flash("notice", "This is a flash message.");
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegistration (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/registration", {title: "New User Registration", nav, errors: null});
    // req.flash("notice", "This is a flash message.")
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerNewAccount(req, res, next) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;
    // Hash the password before storing
    let hashedPassword;

    try {
        //regular pw and cost (salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry there was an error processing the registration.');
        req.status(500).render("account/registration", {title: 'New User Registration', nav, errors: null,})
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
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
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            title: "New User Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res, next) {
    let nav = await utilities.getNav();
    const {account_email, account_password} = req.body;
    let hashedPasswordFromDb = await accountModel.getHashedPassword(account_email);

    try {
        const matchPw = await bcrypt.compare(account_password, hashedPasswordFromDb.account_password);
        res.status(200).render("account/dashboard", {
            title: "Login",
            nav,
            errors: null,
        });
        req.flash("notice", "Login Successful!")

    } catch (error) {
        res.status(501).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    }
}


module.exports = {buildLogin, buildRegistration, registerNewAccount, processLogin}