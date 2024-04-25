const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config')
const usersRouter = require('./controllers/users')

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use('/',usersRouter)

mongoose.connect(config.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

module.exports = app