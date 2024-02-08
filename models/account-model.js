const pool = require('../database');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
        VALUES ($1, $2, $3, $4, 'Client') RETURNING *`;
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (err) {
        return err.message;
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = `SELECT * FROM account WHERE account_email = $1`;
        const email = await pool.query(sql, [account_email]);
        return email.rowCount;
    } catch (error) {
        return error.message;
    }
}

/* **********************
 *   Retrieve Hashed Password
 * ********************* */
async function getHashedPassword(account_email) {
    try {
        const pw = await pool.query(`SELECT account_password FROM account WHERE account_email = $1`, [account_email]);
        console.log(pw.rows);
        return pw.rows[0];
    } catch (error) {
        return error.message;
    }
}




module.exports = {registerAccount, checkExistingEmail, getHashedPassword};