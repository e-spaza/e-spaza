const usersRouter = require('express').Router();
const User = require("../models/user");

usersRouter.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).send('User already exists');
      } else {
        const newUser = new User({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          role: req.body.role
        });
        newUser.save()
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

usersRouter.post('/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(400).send('User does not exist');
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      res.status(500).send('Server error');
    });
});

usersRouter.post('/remove-access', (req, res) => {
  User.findOneAndDelete({ email: req.body.email })
    .then(result => {
      if (!result) {
        return res.status(400).send('User not found');
      }
      res.status(200).json({ message: 'User successfully removed', data: result });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server error');
    });
});

usersRouter.post('/change-role', (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email, role: req.body.oldRole },
    { role: req.body.newRole },
    { new: true }
  )
  .then(result => {
    if (!result) {
      return res.status(400).send('User not found');
    }
    res.status(200).json(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Server error');
  });
});

module.exports = usersRouter;
