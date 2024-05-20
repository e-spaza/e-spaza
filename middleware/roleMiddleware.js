// middleware/roleMiddleware.js
const User = require('../models/user');

const checkRole = (roles) => (req, res, next) => {
    const { email } = req.body; // Assume email is sent in request body or headers

    if (!email) {
        return res.status(401).send('Email not provided');
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            if (roles.includes(user.role)) {
                next();
            } else {
                res.status(403).send('Access denied');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
};

module.exports = checkRole;