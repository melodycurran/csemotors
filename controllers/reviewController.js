const utilities = require('../utilities');
const reviewModel = require('../models/review-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const reviewCont = {};

/* ***************************
 *  Display all reviews
 * ************************** */
reviewCont.displayReviews = async (req, res, next) => {
    const nav = await utilities.getNav();
    //Get all the reviews from the db;
    const reviewData = await reviewModel.getAllReviews();
    let account_id;

    try {
        //Get the token from cookies to see if the user is logged in
        const token = req.cookies.jwt;
        const decoded = utilities.decodeToken(token);
        //If the user is logged in, get the account_id and make it available to the html view
        account_id = decoded.account_id;
    } catch(err) {
        account_id = null;
        console.error(err.message);
    }
    //Map the review template to each item in the data
    const reviewHtmlItems = reviewData.map(item => utilities.reviewTemplate(item.date_posted, item.star, item.review, item.account_firstname, item.account_lastname)).join("");
    
    if (reviewData) {
        res.render('./reviews/review', {title: "Reviews", nav, reviewHtmlItems, errors: null, account_id})
    } else {
        req.flash("notice", "An error occured");
        res.redirect('/review');
    }

}

/* ***************************
 *  Process adding new reviews
 * ************************** */
reviewCont.addNewReview = async (req, res, next) => {
    const nav = utilities.getNav();
    const {account_id, review, star} = req.body;
    let starInt = parseInt(star);
    let accountInt = parseInt(account_id);

    const reviewData = await reviewModel.insertReview(accountInt, review, starInt);
 
    if (reviewData) {
        req.flash("notice", "Your review has been successfully processed!");
        res.status(201).render('/review', {
            title: "Review",
            nav,
            review,
            star,
            errors: null,
        });
    } else {
        req.flash("notice", "There's an error");
        res.status(501).redirect("/review");
    }
}

module.exports = reviewCont;