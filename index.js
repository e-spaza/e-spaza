const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use(cors());

const uri = 'mongodb+srv://menzishazi6:N3T1Gogzx48LQDVX@cluster0.5rog0cg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define a User class or object constructor
class User {
    constructor(id, username, email, password, role) {
        this.id = id; // Unique identifier for the user
        this.username = username; // User's username
        this.email = email; // User's email address
        this.password = password; // Hashed password for security
        this.role = role; // User's role (e.g., 'admin', 'user')
    }

    // Method to check if the user has a certain role
    hasRole(role) {
        return this.role === role;
    }

    // Method to update user information
    updateProfile(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

//route for login information
app.get('/login', (req, res) => {
    
});

//route for admininstration
app.get('/admin', (req, res) => {
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});