INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

ALTER TABLE account
ALTER COLUMN account_type TYPE account_type USING 'Admin';

DELETE FROM account WHERE account_id = 1;

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT inv_make, inv_model, classification_name
FROM inventory v
JOIN classification c
ON c.classification_id = v.classification_id
WHERE classification_name = 'Sport';

UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
	inv_thumbnail = REPLACE(inv_image, 'images', 'images/vehicles');