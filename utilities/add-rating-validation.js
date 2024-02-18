const utilities = require(".");
const reviewModel = require("../models/review-model");
const {body, validationResult} = require("express-validator");
const newReviewValidation = {};

/*  **********************************
 *  New Inventory Data Validation Rules
 * ********************************* */
newReviewValidation.reviewRules = () => {
    return [
        body("star")
        .trim()
        .notEmpty()
        .withMessage("Please choose how many stars you want to rate us."),
        
        body("review")
        .trim()
        .notEmpty()
        .isLength({max: 250})
        .withMessage("Please add a comment."),
    ]
}

/* ******************************
 * Check data and return errors or continue to review
 * ***************************** */
newReviewValidation.checkReview = async (req, res, next) => {
    const nav = await utilities.getNav();
    const {account_id, star, review} = req.body;

    const reviews = await reviewModel.getAllReviews();
    const reviewHtmlItems = reviews.map(item => utilities.reviewTemplate(item.date_posted, item.star, item.review, item.account_firstname, item.account_lastname)).join("");

    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render("./reviews/review", {
            title: "Reviews",
            nav, 
            errors,
            star, 
            review,
            reviewHtmlItems,
            account_id,
        })
        return
    }
    next()
}


module.exports = newReviewValidation;