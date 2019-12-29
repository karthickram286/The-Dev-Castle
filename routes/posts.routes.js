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

/**
 * @route   GET /api/post/getall
 * @desc    Get all posts
 * @access  Private
 */
router.get('/getall', auth, async (req, res) => {
    try {
        // Getting posts and sorting them based on updated time
        const posts = await Post.find().sort({ updatedAt: -1 });

        if (!posts) {
            return res.status(404).json({ msg: 'No posts found' });
        }
        return res.status(200).json(posts);
    } catch (err) {
        logger.error(err.message);
        return res.status(500).send('Server error');
    }
});

/**
 * @route   GET /api/post/get/:post_id
 * @desc    Get a post by Id
 * @access  Private
 */
router.get('/get/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(200).json(post);
    } catch (err) {
        logger.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server error');
    }
});

/**
 * @route   DELETE /api/post/delete/:post_id
 * @desc    Deletes a post for an Id
 * @access  Private
 */
router.delete('/delete/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Checking if the user of the post matches the username of the requested user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();
        return res.status(200).json({ msg: 'Post deleted' });
    } catch (err) {
        logger.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server error');
    }
});

module.exports = router;