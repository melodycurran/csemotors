//required modules
const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const validation = require("../utilities/add-rating-validation");
const utilities = require("../utilities");

//Route to build review display
router.get('/', utilities.handleErrors(reviewController.displayReviews));
//Route to process add review
router.post('/submit-review', validation.reviewRules(), validation.checkReview,
    utilities.handleErrors(reviewController.addNewReview));

module.exports = router;

