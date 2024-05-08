const usersRouter = require('express').Router()
const User = require("../models/user")

usersRouter.post('/signup', (req, res) => {
    // Check if user already exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                res.status(400).send('User already exists');
            } else {
                // If user does not exist, save new user
                const newUser = new User(req.body);
                newUser
                    .save()
                    .then(result => {
                        res.status(201).json(result);
                    })
                    .catch(err => {
                        res.status(500).send('Server error');
                    });
            }
        })
        .catch(err => {
            res.status(500).send('Server error');
        });
});

//route for user login post, send an error if user does not exist
usersRouter.post('/login', (req, res) => {
    // Check if user exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(400).send('User does not exist');
            } else {
                // Send a response with the user details
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).send('Server error');
        });
});

module.exports = usersRouter

// Route for changing role
usersRouter.post('/change-role', (req, res) => {
    User.findOneAndUpdate({ name: req.body.name, role: req.body.oldRole }, { role: req.body.newRole })
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).send('User not found');
            }
        })
        .catch(err => {
            res.status(500).send('Server error');
        });
});

// Route for removing access
usersRouter.post('/remove-access', (req, res) => {
    User.findOneAndDelete({ name: req.body.name, role: req.body.role })
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).send('User not found');
            }
        })
        .catch(err => {
            res.status(500).send('Server error');
        });
});