const express = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');
const axios = require('axios');

const auth = require('../middleware/auth.middleware');
const logger = require('../config/winston.logger');
const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');

const router = express.Router();

const createPostValidation = [
    check('text', 'Text is required').not().isEmpty()
]

const setPostFields = (req, user) => {
    const newPost = {
        text: req.body.text,
        name: user.firstname,
        avatar: user.avatar,
        user: req.user.id
    }
    return newPost;
}

/**
 * @route   POST /api/post/add
 * @desc    Creates a new post
 * @access  Private
 */
router.post('/add', [auth, createPostValidation], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post(setPostFields(req, user));

        const post = await newPost.save();
        return res.status(200).json(post);
    } catch (err) {
        logger.error(err.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;