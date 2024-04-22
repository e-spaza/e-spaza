const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://2453308:Yb1umhk4vs90ZTul@e-spaza.5i4gfc5.mongodb.net/?retryWrites=true&w=majority&appName=e-spaza';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

//route for login information
app.get('/login', (req, res) => {

});

//route for admininstration
app.get('/admin', (req, res) => {

});

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    surname: String,
    email: String,
})

const User = mongoose.model('User', userSchema)

//route for user signup post
//route for user signup post
app.post('/signup', (req, res) => {
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
app.post('/login', (req, res) => {
    // Check if user exists
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});