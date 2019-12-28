"use strict";

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('winston');

const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

const signinUserValidations = [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password should not be empty').not().isEmpty()
]

/**
 * @router  GET /api/auth
 * @desc    Returns the user object for a given auth token in request headers
 * @access  Public
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.status(200).json(user);
    } catch (err) { 
        logger.error('error', err.message);
        return res.status(500).send('Server error');
    }
});

/**
 * @router  POST /api/auth/signin
 * @desc    Returns the auth token for given email & password for a user
 * @access  Publix
 */
router.route('/signin').post(signinUserValidations, async (req, res) => {

    // Validating the user params and sends an error if validation is failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    try {
        // Checking if User exists
        let user = await User.findOne({ email });
        if (!user) {
            logger.error('error', `Invalid email or password`);
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password'}] });
        }

        // Checking if the password is correct
        const isPasswordMatch = bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            logger.error('error', `Invalid email or password`);
            return res.status(400).json({ errors: [{ msg: 'Invalid email or password'}] });
        }

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


module.exports = router;

