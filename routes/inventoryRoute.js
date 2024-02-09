//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const classificationValidate = require("../utilities/add-classification-validation");
const newInventoryValidate = require("../utilities/add-inventory-validation");

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleView));

//Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildManagement));

//Route to build add classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));
//Route to process data from add classification form
router.post("/addClassification", classificationValidate.addingClassificationRules(), 
    classificationValidate.checkClassificationData, utilities.handleErrors(invController.processAddClassification));

//Route to build add vehicle view
router.get("/addInventory", utilities.handleErrors(invController.buildaddInventoryView));
//Route to process add vehicle view data
router.post("/addInventory", newInventoryValidate.inventoryValidationRules(), newInventoryValidate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory));

//Route to get the data to be modified
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
//Route for the modify inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView));
//Route to process edit inventory
router.post("/update/", newInventoryValidate.inventoryValidationRules(), newInventoryValidate.checkUpdateData,
    utilities.handleErrors(invController.processUpdateInventory));

module.exports = router;