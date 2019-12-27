const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.route('/add').post(async (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;

    const user = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    });

    try {
        await user.save();
        res.status(200).json({
            'status': 'User saved'
        });
    } catch (err) {
        res.status(400).send({
            'error': err
        });
    }
});

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