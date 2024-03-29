const utilities = require('.');
const {body, validationResult} = require('express-validator');
const accountModel = require('../models/account-model');
const serverValidation = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
serverValidation.registrationRules = () => {
    return [
        //firstname is required and must be string
        body('account_firstname')
        .trim()
        .isLength({min: 1})
        .withMessage("Please provide a first name."), //on error, this message is sent

        body('account_lastname')
        .trim()
        .isLength({min: 2})
        .withMessage("Please provide a last name."), //on error, this message is sent

        //valid email is required and cannot already exist in the DB
        body('account_email')
        .trim()
        .isEmail()
        .normalizeEmail() //refer to validator.js docs
        .withMessage('A valid email is required.')
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists) {
                throw new Error('Email exists. Please log in or use different email')
            }
        }),

        //password is required and must be strong password
        body('account_password')
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage('Password does not meet requirements.'),
    ]
}

/*  **********************************
 *  Account update Data Validation Rules
 * ********************************* */
serverValidation.accountUpdateRules = () => {
    return [
        body('account_firstname')
        .trim()
        .isLength({min: 1})
        .withMessage("First name should not be empty"),

        body('account_lastname')
        .trim()
        .isLength({min: 1})
        .withMessage("Last name should not be empty"),

        body('account_email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required"),
    ]
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
serverValidation.loginRules = () => {
    return [
        body('account_email')
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("Enter a valid email address")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists) {
                throw new Error('No email exists. Please register')
            }
        }),
    ]
    
}

/*  **********************************
 *  Password update Data Validation Rules
 * ********************************* */
serverValidation.passwordUpdateRules = () => {
    return [
        body('account_password')
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage('Password does not meet requirements.'),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
serverValidation.checkRegData = async(req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/registration', {
            errors,
            title: "New User Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to updating account
 * ***************************** */
serverValidation.checkUpdateData = async(req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('./account/edit-account', {
            errors,
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

serverValidation.checkLogin = async(req, res, next) => {
    let nav = await utilities.getNav();
    const {account_email, account_password} = req.body;
    let errors = [];
    errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.render('account/edit-account', {
            errors,
            title: "Edit Account",
            nav,
        })
        return
    }
    next()

}

/* ******************************
 * Check password and return errors or continue to updating account
 * ***************************** */
serverValidation.checkPasswordUpdate = async (req, res, next) => {
    let nav = await utilities.getNav();
    const {account_password} = req.body;
    let errors = [];
    errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.render('account/login', {
            errors,
            title: "Log in",
            nav,
            account_email,
            account_password,
        })
        return
    }
    next()
}

module.exports = serverValidation;