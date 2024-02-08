//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const managementController = require("../controllers/managementController");
const utilities = require("../utilities");
const classificationValidate = require("../utilities/add-classification-validation");
const newInventoryValidate = require("../utilities/add-inventory-validation");

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleView));

//Route to build vehicle management view
router.get("/", utilities.handleErrors(managementController.buildManagement));

//Route to build add classification view
router.get("/addClassification", utilities.handleErrors(managementController.buildAddClassification));
//Route to process data from add classification form
router.post("/addClassification", classificationValidate.addingClassificationRules(), 
    classificationValidate.checkClassificationData, utilities.handleErrors(managementController.processAddClassification));

//Route to build add vehicle view
router.get("/addInventory", utilities.handleErrors(managementController.buildaddInventoryView));
//Route to process add vehicle view data
router.post("/addInventory", newInventoryValidate.inventoryValidationRules(), newInventoryValidate.checkInventoryData,
    utilities.handleErrors(managementController.processAddInventory));

module.exports = router;