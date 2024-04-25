const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    surname: String,
    email: String,
    role: String
})

const User = mongoose.model('User', userSchema)

module.exports = User
