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

const createCommentValidation = [
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
 * @route   POST /api/post/comment/:post_id
 * @desc    Adds a comment to a post
 * @access  Private
 */
router.post('/comment/:post_id', [auth, createCommentValidation], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const post = await Post.findById(req.params.post_id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user.id,
            avatar: user.avatar
        };

        // Adding comment to the post
        post.comments.unshift(newComment);
        await post.save();

        return res.status(200).json(post.comments);
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
 * @route   PUT /api/post/like/:post_id
 * @desc    Like a post
 * @access  Private
 */
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Checking if the post is already liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        // Adding the user to likes array and saving it
        post.likes.unshift({ user: req.user.id });
        await post.save();
        return res.status(200).json(post.likes);
    } catch (err) {
        logger.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server error');
    }
});

/**
 * @route   PUT /api/post/unlike/:post_id
 * @desc    Unlike a post
 * @access  Private
 */
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Checking whether post is liked or not 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not been liked' });
        }

        // Finding the index and removing the like
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();
        return res.status(200).json(post.likes);
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

        // Checking if the userId of the post matches the userId of the requested user
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

/**
 * @route   DELETE /api/post/comment/:post_id/:comment_id
 * @desc    Deletes a comment from a post given both postId and commentId
 * @access  Private
 */
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        // Checking if the comment exists in this post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Checking if the userId of the comment matches the userId of the requested user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Finding the index and removing the comment
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        return res.status(200).json(post.comments);
    } catch (err) {
        logger.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).send('Server error');
    }
});

module.exports = router;