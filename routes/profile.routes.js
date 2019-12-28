const express = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth.middleware');
const logger = require('../config/winston.logger');
const Profile = require('../models/profile.model');
const User = require('../models/user.model');

const router = express.Router();

const createProfileValidations = [
    check('status', 'Statis is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
];

/**
 * @route   GET /api/profile/me
 * @desc    Returns the profile of an user
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('User', ['firstname', 'lastname', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: `There's no profile for this user` });
        }
       
        return res.status(200).json(profile);
    } catch (err) {
        logger.error(err.message);
        return res.status(500).send('Server error');
    }
});

/**
 * 
 * @param {Request from client}     req 
 * @desc                            Sets the field values from request params
 */
const setProfileFields = (req) => {
    // Destructuring the values from request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        linkedin,
        instagram,
        xing,
        stackoverflow
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    
    // Setting social fields
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (xing) profileFields.social.xing = xing;
    if (instagram) profileFields.social.instagram = instagram;
    if (stackoverflow) profileFields.social.stackoverflow = stackoverflow; 

    return profileFields;
}

/**
 * @route   POST /api/profile/create
 * @desc    Creates a profile for an user. If the profile already exists, updates the profile
 * @access  Private
 */
router.post('/update', [auth, createProfileValidations], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.error(`Profile validation failed`);
        return res.status(400).json({ errors: errors.array() });
    }

    const profileFields = setProfileFields(req);
    
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        // If Profile already exists, update the profile
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFields },
                { new: true }
            );
            return res.status(200).json(profile);
        }

        // If Profile doesn't exists, create the profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.status(200).json(profile);

    } catch (err) {
        logger.error(err.message);
        return res.status(500).send(`Server error`);
    }
});

module.exports = router;