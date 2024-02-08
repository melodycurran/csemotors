const utilities = require('../utilities');
const invModel = require("../models/inventory-model");
const managementController = {};

/* ***************************
 *  Build management view
 * ************************** */
managementController.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {title: "Vehicle Management", nav, })
}

/* ***************************
 *  Build add classification view
 * ************************** */
managementController.buildAddClassification = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {title: "Add New Classification", nav, errors: null})
}

/* ****************************************
*  Process Add Classification Form
* *************************************** */
managementController.processAddClassification = async (req, res, next) => {
    const {classification_name} = req.body;
    const classNameResult = await invModel.addNewClassification(classification_name);
    if (classNameResult) {
        let nav = await utilities.getNav();
        req.flash("notice", `Congrats, you\'ve successfully added ${classification_name}`);
        res.status(201).render("./inventory/add-classification", {
            title: "Add New Classification Success",
            nav,
            errors: null,
        })

        //Might not need this line
    } else {
        let nav = await utilities.getNav();
        req.flash("notice", "Sorry, the operation failed. Try again");
        res.status(501).render("./inventory/add-classification", {
            title: "Failed",
            nav,
            errors: null,
        })
    }
}

/* ***************************
 *  Build Add inventory view
 * ************************** */
managementController.buildaddInventoryView = async (req, res, next) => {
    const nav = await utilities.getNav();
    const select = await utilities.buildClassificationSelection()
    res.render("./inventory/add-inventory", {title: "Add New Inventory", nav, errors: null, select});
}

/* ****************************************
*  Process Add Inventory Form
* *************************************** */
managementController.processAddInventory = async (req, res, next) => {
    const nav = await utilities.getNav();
    const select = await utilities.buildClassificationSelection()
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

    const invResult = await invModel.addNewInventory(
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
    );

    if (invResult) {
        req.flash("notice", "Congrats, You\'ve added a new inventory");
        res.status(201).render("./inventory/add-inventory", {title: "Add Inventory", nav, errors: null, select})
    } else {
        req.flash("notice", "Sorry, the operation has failed");
        res.status(501).render("./inventory/add-inventory", {title: "Add Inventory", nav, errors: null, select})
    }
}

module.exports = managementController;