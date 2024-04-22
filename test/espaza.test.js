const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

// Define a Mongoose model named 'User' with a schema specifying the structure of user documents
const User = mongoose.model('User', new mongoose.Schema({
    id: String,
    name: String,
    surname: String,
    email: String,
}));

// Connecting to the database before each test
beforeAll(async () => {
    try {
        await mongoose.connect("mongodb+srv://2453308:Yb1umhk4vs90ZTul@e-spaza.5i4gfc5.mongodb.net/?retryWrites=true&w=majority&appName=e-spaza");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Exit the test suite if MongoDB connection fails
        process.exit(1); 
    }
});

// Closing database connection after each test
afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        // Exit the test suite if closing connection fails
        process.exit(1); 
    }
});

// Define the routes for user signup
app.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const newUser = new User({
            id: req.body.id,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
        });

        await newUser.save();
        res.status(201).json(newUser);

    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).send('Server Error');
    }
});

// Define the routes for user login
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send('User does not exist');
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send('Server Error');
    }
});

// Function to generate random user data
const generateRandomUserData = () => {
    const id = Math.floor(Math.random() * 1000000).toString();
    const name = 'John';
    const surname = 'Doe';
    const email = `john${id}@example.com`;

    return {
        id: id,
        name: name,
        surname: surname,
        email: email,
    };
};

// Function to generate random email
const generateRandomEmail = () => {
    return 'random@example.com';
};

// Test cases for user sign up
describe('POST /signup', () => {
    // Test case for signing up a new user
    it('should create a new user', async () => {
        const userData = generateRandomUserData();

        const response = await request(app)
            .post('/signup')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(userData.name);
        expect(response.body.surname).toBe(userData.surname);
        expect(response.body.email).toBe(userData.email);
    });

    // Test case for signing up an existing user
    it('should return an error if user already exists', async () => {
        const userData = generateRandomUserData();

        await request(app)
            .post('/signup')
            .send(userData);

        const response = await request(app)
            .post('/signup')
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.text).toBe('User already exists');
    });
});

// Test cases for user login
describe('POST /login', () => {
    // Test case for logging in a user
    it('should log in a user', async () => {
        const userData = generateRandomUserData();

        await request(app)
            .post('/signup')
            .send(userData);

        const response = await request(app)
            .post('/login')
            .send({ email: userData.email });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(userData.name);
        expect(response.body.surname).toBe(userData.surname);
        expect(response.body.email).toBe(userData.email);
    });

    // Test case for logging in a user that does not exist
    it('should return an error if user does not exist', async () => {
        const nonExistingEmail = generateRandomEmail();

        const response = await request(app)
            .post('/login')
            .send({ email: nonExistingEmail });

        expect(response.status).toBe(400);
        expect(response.text).toBe('User does not exist');
    });
});