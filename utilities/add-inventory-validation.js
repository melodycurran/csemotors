const utilities = require(".");
const {body, validationResult} = require("express-validator");
const newInventoryValidation = {};

/*  **********************************
 *  New Classification Data Validation Rules
 * ********************************* */
newInventoryValidation.inventoryValidationRules = () => {
    return [
        body("classification_id")
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("Please choose a classification name"),

        body("inv_make")
        .trim()
        .notEmpty()
        .isAlpha()
        .withMessage("Please provide a valid vehicle make"),

        body("inv_model")
        .trim()
        .notEmpty()
        .isAlpha()
        .isLength({min: 1})
        .withMessage("Please provide a valid vehicle model"),

        body("inv_description")
        .trim()
        .notEmpty()
        .isLength({max: 250})
        .withMessage("Character limit is up to 250"),

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please provide a valid vehicle image path")
        .custom( async (inv_image) => {
            console.log(inv_image);
            let regex = new RegExp('(\/).(\\w+).(\\w+).*(\.)(gif|png|jpg|jpeg)', 'g');
            let matched = regex.test(inv_image);
            console.log(matched);
            if (!matched) {
                throw new Error("Please supply image path in proper format");
            }
        }),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a valid vehicle thumbnail path")
        .custom( async (inv_thumbnail) => {
            console.log(inv_thumbnail);
            let regex = new RegExp('(\/).(\\w+).(\\w+).*(\.)(gif|png|jpg|jpeg)', 'g');
            let matched = regex.test(inv_thumbnail);
            console.log(matched);
            if (!matched) {
                throw new Error("Please supply thumbnail path in proper format");
            }
        }),

        body("inv_price")
        .trim()
        .notEmpty()
        .isNumeric()
        .withMessage("Please provide a valid vehicle price"),

        body("inv_year")
        .trim()
        .notEmpty()
        .isNumeric()
        .withMessage("Please provide a valid vehicle year"),

        body("inv_miles")
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid vehicle miles"),

        body("inv_color")
        .trim()
        .notEmpty()
        .isAlpha()
        .withMessage("Please provide a valid vehicle color"),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
newInventoryValidation.checkInventoryData = async (req, res, next) => {
    const nav = await utilities.getNav();

    const {
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id} = req.body;

    const select = await utilities.buildClassificationSelection(classification_id);
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory Error", 
            nav,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
            select,
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to modifying inventory
 * ***************************** */
newInventoryValidation.checkUpdateData = async (req, res, next) => {
    const nav = await utilities.getNav();
    const {
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id,
        inv_id } = req.body;

    const select = await utilities.buildClassificationSelection(classification_id);
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render("./inventory/edit-inventory", {
            errors,
            title: `Modify ${inv_make} ${inv_model}`, 
            nav,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
            inv_id,
            select,
        })
        return
    }
    next()
}

module.exports = newInventoryValidation;