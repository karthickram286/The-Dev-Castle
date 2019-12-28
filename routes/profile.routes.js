const express = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth.middleware');
const logger = require('../config/winston.logger');
const Profile = require('../models/profile.model');
const User = require('../models/user.model');

const router = express.Router();

const createProfileValidations = [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
];

const experienceValidation = [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
];

const educationValidation = [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
];

/**
 * @route   GET /api/profile/me
 * @desc    Returns the profile of an user
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['firstname', 'lastname', 'avatar']);

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
 * @route   GET /api/profile
 * @desc    Returns all the profiles
 * @access  Public
 */
router.get('/getall', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['firstname', 'lastname', 'avatar']);
        
        if (!profiles) {
            return res.status(400).json({ msg: `No profiles were created so far`});
        }
        return res.status(200).json(profiles);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send('Server error');
    }
});

/**
 * @route   GET /api/profile/user/:userId
 * @desc    Returns a profile for a given userId
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['firstname', 'lastname', 'avatar']);
        
        if (!profile) {
            return res.status(400).json({ msg: `Profile not found` });
        }
        return res.status(200).json(profile);
    } catch (error) {
        logger.error(error.message);

        // For an invalid objectId, sending the same response as 'profile not found'
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: `Profile not found` });
        }
        return res.status(500).send('Server error');
    }
});

/**
 * 
 * @param {Request from client} req 
 * @desc                        Sets the profile field values from request params
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

/**
 * 
 * @param {Request from client}     req 
 * @desc                            Sets the experience field values from request params
 */
const setExperienceFields = (req) => {

    // Destructuring values from request
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    return newExperience;
}

/**
 * @route   PUT /api/profile/experience
 * @desc    Adds the experience to the profile
 * @access  Private
 */
router.put('/experience', [auth, experienceValidation], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const newExperience = setExperienceFields(req);
        if (profile) {
            profile.experience.unshift(newExperience);
            await profile.save();
            return res.status(200).json(profile);
        } else {
            return res.status(400).send(`Profile deosn't exist`);
        }
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send('Server error');
    }
});

/**
 * 
 * @param {Request from client}     req 
 * @desc                            Sets the education field values from request params
 */
const setEducationFields = (req) => {

    // Destructuring values from request
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    return newEducation;
}

/**
 * @route   PUT /api/profile/education
 * @desc    Adds the education to the profile
 * @access  Private
 */
router.put('/education', [auth, educationValidation], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const newEducation = setEducationFields(req);
        if (profile) {
            profile.education.unshift(newEducation);
            await profile.save();
            return res.status(200).json(profile);
        } else {
            return res.status(400).send(`Profile deosn't exist`);
        }
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send('Server error');
    }
});

/**
 * @route   DELETE /api/profile/delete
 * @desc    Deletes a profile, user and posts
 * @access  Private
 */
router.delete('/delete', auth, async (req, res) => {
    try {

        // @todo - remove posts

        // Removing profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Removing user
        await User.findOneAndRemove({ _id: req.user.id });

        return res.status(200).json({ msg: 'User deleted' });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send('Server error');
    }
});

/**
 * @route   DELETE /api/profile/experience/delete/:exp_id
 * @desc    Deletes an experience in a profile 
 * @access  Private
 */
router.delete('/experience/delete/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Finding the index for the exp_id and removing it
        let removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);
        if (removeIndex === -1) {
            return res.status(400).json({ msg: `Invalid experience id`});
        }
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        return res.status(200).json(profile);
    } catch (error) {
        logger.error(err.message);
        return res.status(500).send('Server error');
    }
});

/**
 * @route   DELETE /api/profile/education/delete/:edu_id
 * @desc    Deletes an education in a profile 
 * @access  Private
 */
router.delete('/education/delete/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Finding the index for the exp_id and removing it
        let removeIndex = profile.education.map(edu => edu.id).indexOf(req.params.edu_id);
        if (removeIndex === -1) {
            return res.status(400).json({ msg: `Invalid education id`});
        } 
        profile.education.splice(removeIndex, 1); 

        await profile.save();
        return res.status(200).json(profile); 
    } catch (error) {
        logger.error(err.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;