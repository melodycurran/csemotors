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

invCont.buildVehicleView = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId;
    let nav = await utilities.getNav();
    const data = await invModel.getInventoryByInventoryId(vehicle_id);
    let vehicleView = await utilities.buildVehiclePage(data[0]);
    let vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;

    res.render("./inventory/vehicle", {title: vehicleName, vehicleView, nav});
}


module.exports = invCont;