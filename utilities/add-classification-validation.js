const utilities = require(".");
const {body, validationResult} = require("express-validator");
const newClassificationModel = require("../models/inventory-model");
const newClassificationValidation = {};

/*  **********************************
 *  New Classification Data Validation Rules
 * ********************************* */

newClassificationValidation.addingClassificationRules = () => {
    return [
        body('classification_name')
        .trim()
        .isAlphanumeric()
        .isLength({min: 1})
        .notEmpty()
        .withMessage('Please provide a valid classification name.')
        .custom(async (classification_name) => {
            const nameExists = await newClassificationModel.checkExistingClassification(classification_name);
            if (nameExists) {
                throw new Error('The classification name you provided already exists.');
            }
        })

    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
newClassificationValidation.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("./inventory/add-classification", {
            errors, 
            title: "Add New Classification Error",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = newClassificationValidation;
