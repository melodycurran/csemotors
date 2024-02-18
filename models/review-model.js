const pool = require('../database');

/* ***************************
 *  Gets all data from 'review' table
 * ************************** */
async function getAllReviews() {
    try {
        const sql = `SELECT account_firstname, account_lastname, review, star, date_posted FROM public.review r
        JOIN public.account a
        ON r.account_id = a.account_id
        ORDER BY date_posted ASC`;
        const reviewData = await pool.query(sql);
        return reviewData.rows;
    } catch (err) {
        return err.message;
    }
}

/* ***************************
 *  Gets all data from 'review' table by account_id
 * ************************** */
async function getReviewByAccountId(account_id) {
    try {
        const sql = `SELECT review, star, date_posted FROM review WHERE account_id = $1`;
        const reviewData = await pool.query(sql, [account_id]);
        return reviewData.rows;
    } catch(err) {
        return err.message;
    }
}

/* ***************************
 *  Write review data into 'review' table
 * ************************** */
async function insertReview(account_id, review, star) {
    try {
        const sql = `INSERT INTO public.review (account_id, review, star, date_posted) VALUES ($1, $2, $3, NOW()) RETURNING *`;
        const reviewData = await pool.query(sql, [account_id, review, star]);
        return reviewData;
    } catch(err) {
        return err.message;
    }
}

module.exports = {
    insertReview,
    getAllReviews,
    getReviewByAccountId,
}