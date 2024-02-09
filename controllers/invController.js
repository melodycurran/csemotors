const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {title: className + " vehicles", nav, grid, });
}

/* ***************************
 *  Build Vehicle View
 * ************************** */
invCont.buildVehicleView = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId;
    let nav = await utilities.getNav();
    const data = await invModel.getInventoryByInventoryId(vehicle_id);
    let vehicleView = await utilities.buildVehiclePage(data);
    let vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;

    res.render("./inventory/vehicle", {title: vehicleName, vehicleView, nav});
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationSelection();

    res.render("./inventory/management", {title: "Vehicle Management", nav, classificationSelect});
    
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {title: "Add New Classification", nav, errors: null})
}

/* ****************************************
*  Process Add Classification Form
* *************************************** */
invCont.processAddClassification = async (req, res, next) => {
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
invCont.buildaddInventoryView = async (req, res, next) => {
    const nav = await utilities.getNav();
    const select = await utilities.buildClassificationSelection()
    res.render("./inventory/add-inventory", {title: "Add New Inventory", nav, errors: null, select});
}

/* ****************************************
*  Process Insert Inventory data
* *************************************** */
invCont.processAddInventory = async (req, res, next) => {
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classifiction_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classifiction_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* ***************************
 *  Build Edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async (req, res, next) => {
    const nav = await utilities.getNav();
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const name = `${data.inv_make} ${data.inv_model}`
    const select = await utilities.buildClassificationSelection(data.classification_id)

    console.log(data);
    res.render("./inventory/edit-inventory", {
        title: `Modify ${name}`, 
        nav, 
        errors: null, 
        select,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_description: data.inv_description,
        inv_image: data.inv_image,
        inv_thumbnail: data.inv_thumbnail,
        inv_price: data.inv_price,
        inv_year: data.inv_year,
        inv_miles: data.inv_miles,
        inv_color: data.inv_color,
        inv_id: data.inv_id,
    });
}

/* ****************************************
*  Process Update Inventory data
* *************************************** */
invCont.processUpdateInventory = async (req, res, next) => {
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

    const invResult = await invModel.updateInventory(
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
    );

    if (invResult) {
        const name = `${inv_make} ${inv_model}`
        req.flash("notice", `The item ${name} was successfully updated.`);
        res.redirect("/inv/")
    } else {
        const select = await utilities.buildClassificationSelection(classification_id)
        const name = `${invResult.inv_make} ${invResult.inv_model}`
        req.flash("notice", "Sorry, the update failed");
        res.status(501).render("./inventory/edit-inventory", {
            title: `Edit ${name}`, 
            nav, 
            errors: null, 
            select,
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
        })
    }
}


module.exports = invCont;