const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const reviewModel = require('../models/review-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    const acctCredentials = await accountModel.retrieveAccountwithEmail(account_email);

    if (!acctCredentials) {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {title: "Log In", nav, errors: null, account_email});
        return
    }
    
    try {
        if (await bcrypt.compare(account_password, acctCredentials.account_password)) {
            delete acctCredentials.account_password;
            const accessToken = jwt.sign(acctCredentials, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000});
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
            return res.redirect("/account");
        } else {
            req.flash("notice", "Please check your credentials and try again.");
            res.status(400).render("account/login", {title: "Log In", nav, errors: null, account_email});
            return
        }
    } catch (error) {
        next();
        return new Error('Access Forbidden');
    }
}

/* ****************************************
*  Deliver Account Management view
* *************************************** */
async function buildLoginManagement (req, res, next) {
    let nav = await utilities.getNav();
    const token = req.cookies.jwt;
    const decodedToken = utilities.decodeToken(token);
    const data = await accountModel.retrieveAccountwithId(decodedToken.account_id);
    const review = await reviewModel.getReviewByAccountId(decodedToken.account_id);
    let reviewHTML;

    if (!token) {
        res.redirect("/login");
        return error.message;
    }

    if (review.length === 0) {
        reviewHTML = `<p>You don't have any reviews yet.</p>`
    } else {
        reviewHTML = review.map(item => utilities.reviewTemplate(item.date_posted, item.star, item.review)).join("");
    }
    
    res.render("account/account-management", {
        title: "Account Management", 
        nav, 
        errors: null,
        account_type: data.account_type,
        account_firstname: data.account_firstname,
        account_id: data.account_id,
        reviewHTML,
    });
}

/* ****************************************
*  Deliver Edit Account view
* *************************************** */
async function displayEditView (req, res, next) {
    const nav = await utilities.getNav();
    const token = req.cookies.jwt;
    const decodedToken = utilities.decodeToken(token);

    const data = await accountModel.retrieveAccountwithId(decodedToken.account_id);

    res.render("account/edit-account", {
        title: "Edit Account", 
        nav, 
        errors: null,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_id: data.account_id,
    })
}

/* ****************************************
*  Process Edit Account view
* *************************************** */
async function processAccountUpdate (req, res, next) {
    const nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_id} = req.body;

    const updateResult = accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id);

    if (updateResult) {

        //Once the update is complete, the token will be removed and replaced
        res.clearCookie("jwt");
        const newData = await accountModel.retrieveAccountwithId(account_id);
        delete newData.account_password;
        const accessToken = jwt.sign(newData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000});
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
        
        req.flash("notice", "You have successfully updated your account");
        res.redirect("/account");
    } else {
        req.flash("Accout update failed");
        res.render("account/edit-account", {
            title: "Edit Account", 
            nav, 
            errors: null,
            account_firstname: newData.account_firstname,
            account_lastname: newData.account_lastname,
            account_email: newData.account_email,
            account_id: newData.account_id,
        })
    }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function processPasswordUpdate (req, res, next) {
    const nav = await utilities.getNav();
    const {account_password, account_id} = req.body;
    let hashedPassword;

    try {
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (err) {
        req.flash("notice", 'Sorry there was an error updating the password.');
        req.status(500).render("account/edit-account", {title: 'Edit Account', nav, errors: null,})
    }
 
    const updateResult = accountModel.updatePassword(hashedPassword, account_id);
    if (updateResult) {
        req.flash("notice", "Your password update was successful!");
        res.redirect("/account");
    } else {
        req.flash("Password update failed");
        res.render("account/edit-account", {
            title: "Edit Account", 
            nav, 
            errors: null,
            account_firstname: data.account_firstname,
            account_lastname: data.account_lastname,
            account_email: data.account_email,
            account_id: data.account_id,
        })
    }
} 

/* ****************************************
*  Process Logout
* *************************************** */
async function processLogout (req, res, next) {
    const nav = await utilities.getNav();
    res.clearCookie("jwt");

    req.flash("notice", "You're logged out. Log back in to access your account.")
    res.redirect("/account/login");

}

module.exports = {
    buildLogin, 
    buildRegistration, 
    registerNewAccount, 
    processLogin, 
    buildLoginManagement,
    displayEditView,
    processAccountUpdate,
    processPasswordUpdate,
    processLogout,
}