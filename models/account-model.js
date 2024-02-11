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
 *   Retrieve Account using email
 * ********************* */
async function retrieveAccountwithEmail(account_email) {
    try {
        const acctData = await pool.query(`SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1`, [account_email]);
        return acctData.rows[0];
    } catch (error) {
        return error.message;
    }
}

/* **********************
 *   Retrieve Account using account_id
 * ********************* */
async function retrieveAccountwithId(account_id) {
    try {
        const acctData = await pool.query(`SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1`, [account_id]);
        return acctData.rows[0];
    } catch (error) {
        return error.message;
    }
}


/* **********************
 *   Process Account Update
 * ********************* */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
    try {
        const sql = `UPDATE public.account
            SET 
            account_firstname = $1,
            account_lastname = $2,
            account_email = $3
            WHERE account_id = $4 RETURNING *`;

        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    } catch (err) {
        return err.message;
    }
}

/* **********************
 *   Process Password Update
 * ********************* */
async function updatePassword(account_password, account_id) {
    try {
        const sql = `UPDATE public.account
            SET account_password = $1 WHERE account_id = $2 RETURNING *`;
        return await pool.query(sql, [account_password, account_id]);
    } catch (err) {
        return err.message;
    }
}




module.exports = {
    registerAccount, 
    checkExistingEmail, 
    retrieveAccountwithEmail,
    updateAccount,
    retrieveAccountwithId,
    updatePassword,
};