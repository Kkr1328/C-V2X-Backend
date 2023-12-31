const express = require('express');
const {
	getDrivers,
	getDriversList,
	getDriver,
	createDriver,
	updateDriver,
	deleteDriver,
} = require('../controllers/drivers');

const router = express.Router();

router.route('/').put(getDrivers).post(createDriver);
router.route('/list').get(getDriversList);
router.route('/:id').get(getDriver).put(updateDriver).delete(deleteDriver);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Drivers
 *  description: The Drivers managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - username
 *         - password
 *         - phone_no
 *       properties:
 *         first_name:
 *           type: string
 *           description: The first name of the driver.
 *         last_name:
 *           type: string
 *           description: The last name of the driver.
 *         username:
 *           type: string
 *           description: The username of the driver.
 *         password:
 *           type: string
 *           description: The password of the driver.
 *         phone_no:
 *           type: string
 *           description: The phone number of the driver.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the driver was created.
 *       example:
 *         first_name: John
 *         last_name: Doe
 *         username: john_doe
 *         password: password123
 *         phone_no: +1234567890
 *         createdAt: '2023-01-01T00:00:00.000Z'
 */

/**
 * @swagger
 * /api/drivers:
 *   put:
 *     summary: Get drivers based on filters
 *     description: Retrieve a list of drivers based on specified filters.
 *     tags:
 *       - Drivers
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: "609e44902136d23c14ab8db1"
 *             first_name: "John"
 *             last_name: "Doe"
 *             phone_no: "123-456-7890"
 *             username: "johndoe"
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A list of drivers based on the specified filters.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - id: "609e44902136d23c14ab8db1"
 *                   name: "John Doe"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   phone_no: "123-456-7890"
 *                   username: "johndoe"
 *                 - id: "609e44902136d23c14ab8db2"
 *                   name: "Jane Smith"
 *                   first_name: "Jane"
 *                   last_name: "Smith"
 *                   phone_no: "987-654-3210"
 *                   username: "janesmith"
 *       '400':
 *         description: An error response with details.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Invalid request parameters"
 */

/**
 * @swagger
 * /api/drivers/list:
 *   get:
 *     summary: Get all drivers list
 *     description: Retrieve a list of all drivers with minimal details.
 *     tags:
 *       - Drivers
 *     responses:
 *       '200':
 *         description: A list of drivers with minimal details.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - id: "123"
 *                   name: "John Doe"
 *                 - id: "456"
 *                   name: "Jane Smith"
 *       '400':
 *         description: An error response with details.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Invalid request parameters"
 */

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a single driver
 *     description: Retrieve details of a specific driver by ID.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the driver to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Details of the specified driver.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "123"
 *                 name: "John Doe"
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 phone_no: "123-456-7890"
 *                 username: "john.doe"
 *       '404':
 *         description: An error response when the driver is not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "The driver not found"
 *       '400':
 *         description: An error response with details.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Invalid request parameters"
 */

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver
 *     description: Create a new driver with the provided information.
 *     tags:
 *       - Drivers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             first_name: "John"
 *             last_name: "Doe"
 *             username: "john_doe"
 *             password: "secret123"
 *             phone_no: "123-456-7890"
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_no:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *               - username
 *               - password
 *               - phone_no
 *     responses:
 *       '201':
 *         description: Details of the created driver.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "123"
 *                 name: "John Doe"
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 phone_no: "123-456-7890"
 *                 username: "john_doe"
 *       '400':
 *         description: An error response with details.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 - "Please add a first_name"
 *                 - "Please add a last_name"
 *                 - "Please add a username"
 *                 - "Please add a password"
 *                 - "Please add a phone_no"
 *                 - "First name should not contain spaces"
 *                 - "Last name should not contain spaces"
 *                 - "Username should not contain spaces"
 *                 - "Username already exists"
 *                 - "Password should not contain spaces and should be at least 8 characters"
 *                 - "Phone Number should be xxx-xxx-xxxx format"
 */

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: Update a driver
 *     description: Update the information of a specific driver by ID.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the driver to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             first_name: John
 *             last_name: Doe
 *             username: john_doe
 *             password: new_secret123
 *             phone_no: 987-654-3210
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_no:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Details of the updated driver.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "5fe5b4a27f6e4f001f4fcf79"
 *                 name: "John Doe"
 *                 first_name: "John"
 *                 last_name: "Doe"
 *                 phone_no: "987-654-3210"
 *                 username: "john_doe"
 *       '404':
 *         description: An error response when the driver is not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "The driver not found"
 *       '400':
 *         description: An error response with details.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 - "First name should not contain spaces"
 *                 - "Last name should not contain spaces"
 *                 - "Name already exists"
 *                 - "Username should not contain spaces"
 *                 - "Username already exists"
 *                 - "Password should not contain spaces and should be at least 8 characters"
 *                 - "Phone Number should be xxx-xxx-xxxx format"
 */

/**
 * @swagger
 * /api/drivers/{id}:
 *   delete:
 *     summary: Delete a driver
 *     description: Delete a specific driver by ID and update associated cars.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the driver to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Confirmation of successful deletion.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *       '404':
 *         description: An error response when the driver is not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "The driver not found"
 *       '400':
 *         description: An error response with details.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Invalid request parameters"
 */
