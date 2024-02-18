const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list += 
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })

    list += "</ul>"
    return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
    let grid
    if(data.length > 0) {
        grid = `<ul id="inv-display">`
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img class="inv_display__img" src="'+ vehicle.inv_thumbnail
            +'" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '</span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid;
}

/* **************************************
* Build the vehicle page view HTML
* ************************************ */
Util.buildVehiclePage = async function(element) {
   return `<div id="vehicle-page">
        <img src="${element.inv_image}" alt="Image of ${element.inv_make} ${element.inv_model} on CSE Motors">

        <section>
            <h2>${element.inv_year} ${element.inv_make} ${element.inv_model} Details</h2>
            <p class="vehicle_page__price">Price: $${new Intl.NumberFormat('en-US').format(element.inv_price)}</p>
            <p class="vehicle_page__desc"><span>Description: </span>${element.inv_description}</p>
            <p class="vehicle_page__color"><span>Color: </span>${element.inv_color}</p>
            <p class="vehicle_page__miles"><span>Miles: </span>${element.inv_miles.toLocaleString('en-US')}</p>
        </section>
    </div>`;
}

/* **************************************
* Build the classification selection view HTML for Add Inventory
* ************************************ */
Util.buildClassificationSelection = async function(id) {
    let data = await invModel.getClassifications();
    let select = `<select id="choose-classification" name="classification_id" required>`;
    let option;
    select += `<option value="">Select classification</option>`
    data.rows.forEach((row) => {

        option = `<option id="${row.classification_id}" value="${row.classification_id}">${row.classification_name}</option>`

        if (id == row.classification_id) {
            option = `<option id="${row.classification_id}" value="${row.classification_id}" selected>${row.classification_name}</option>`
        }

        select += option;
        
    });
    select += `</select>`;

    return select;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountCredential) {
                if (err) {
                    req.flash("Please log in");
                    res.clearCookie("jwt");
                    return res.redirect("/account/login");
                }
                res.locals.accountCredential = accountCredential;
                res.locals.loggedIn = 1;
                next();
            }
        )
    } else {
        next();
    }
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedIn) {
        next();
    } else {
        req.flash("notice", "Please log in.");
        return res.redirect("account/login");
    }
}

/* ****************************************
 *  Decode JWT token from cookie
 * ************************************ */
Util.decodeToken = (token) => {
    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return data;
    } catch (err) {
        console.error(err.message);
    }
}

/* **************************************
* Build the review view HTML template
* ************************************ */
Util.reviewTemplate = (date_posted, star, review, account_firstname, account_lastname) => {
    let starRating = `<span>`
    let starString = `stars`;
    let ul;

    if (star === 1) {
        starString = `star`;
    }

    //Turn the rating from number to star icons when displayed
    for (i = 0; i < star; i++) {
        starRating += `<span class="material-symbols-outlined">
            star_rate
        </span>`
    }
    starRating += `</span>`;

    if (account_firstname && account_lastname) {
        ul = `<ul class="review">
            <li>By: <span>${account_firstname} ${account_lastname}</span></li>
            <li>${date_posted}</li>
            <li>${starRating} ${star} ${starString}</li>
            <li>${review}</li>
        </ul>`;
    } else {
        ul = `<ul class="review">
            <li>${date_posted}</li>
            <li>${starRating} ${star} ${starString}</li>
            <li>${review}</li>
        </ul>`;
    }
    
    return ul;
}


module.exports = Util;