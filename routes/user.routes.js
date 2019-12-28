"use strict";

const express = require('express');
const { check, validationResult } = require('express-validator');
const logger = require('winston');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/user.model');

const router = express.Router();

const registerUserValidations = [
    check('firstname', 'First name is required').not().isEmpty(),
    check('lastname', 'Last name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password should be 8 or more characters').isLength({ min: 8 }),
];

/**
 * @route   POST /api/users/add
 * @desc    Registers a new user
 * @access  Public
 */
router.route('/add').post(registerUserValidations, async (req, res) => {

    // Validating the user params and sends an error if validation is failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { firstname, lastname, email, password } = req.body;

    // Checking if User already exists
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('warn', `Email-Id already registered for ${email}`);
            return res.status(400).json({ errors: [{ msg: 'User already registered'}] });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // Creating an avatar for the user
        const userAvatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        // Saving the user to DB
        const user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            avatar: userAvatar
        });

        await user.save();

        // Returning JWT for the registered user
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 36000 },
            (err, token) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({ token });
            });

    } catch (err) {
        logger.error(`Server error: ${err}`);
        return res.status(500).send(`Server error`);
    }
});

/**
 * @route   GET api/users/get/{id}
 * @desc    Gets an User for a given Id
 * @access  Public
 */
router.route('/get/:id').get(async (req, res) => {
    let id = req.params.id;

    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
});

router.route('/getAll').get(async (req, res) => {
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send('Error: ' + err);
    }
})

module.exports = router;