const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const config = require("../utils/config");

const app = express();
app.use(express.json());

// Define a Mongoose model with a schema specifying the structure of user documents
const User = mongoose.model('User', new mongoose.Schema({
    id: String,
    name: String,
    surname: String,
    email: String,
}));

// Define a Mongoose model with a schema specifying the structure of order documents
const Order = mongoose.model('Order', new mongoose.Schema({
    product: String,
    price: Number,
    quantity: Number,
    cartId: String,
    email: String,
}));

// Define a Mongoose model with a schema specifying the structure of product documents
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
}));

// Connecting to the database before all tests
beforeAll(async () => {
    try {
        await mongoose.connect(config.uri);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Exit the test suite if MongoDB connection fails
        process.exit(1); 
    }
});

// Closing database connection after all tests
afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        // Exit the test suite if closing connection fails
        process.exit(1); 
    }
});

// Define the route for user signup
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

// Define the route for user login
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

// Define the route for placing an order
app.post('/placeOrder', async (req, res) => {
    try {
        const newOrder = new Order({
            product: req.body.product,
            price: req.body.price,
            quantity: req.body.quantity,
            cartId: req.body.cartId,
            email: req.body.email,
        });

        await newOrder.save();
        res.status(201).json('Order placed!');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Server Error');
    }
});

// Define the route for fetching orders by user email
app.get('/orders', async (req, res) => {
    const userEmail = req.query.email;

    try {
        const orders = await Order.find({ email: userEmail });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'An error occurred while fetching orders' });
    }
});

// Define the route for retrieving products
app.post('/homepage', async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.body.product });

        if (!product) {
            res.status(400).send('Product does not exist');
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('Server error');
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

// Function to generate random product data
const generateRandomProductData = () => {
    return {
        name: 'Test Product',
        description: 'This is a test product',
        price: 20,
    };
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

// Test cases for order placement
describe('POST /placeOrder', () => {
    it('should place a new order', async () => {
        const orderData = generateRandomOrderData();

        const response = await request(app)
            .post('/placeOrder')
            .send(orderData);

        expect(response.status).toBe(201);
        expect(response.body).toBe('Order placed!');
    });
});

// Test cases for fetching orders by user email
describe('GET /orders', () => {
    it('should fetch orders by user email', async () => {
        const userEmail = 'test@example.com';

        const response = await request(app)
            .get(`/orders?email=${userEmail}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

// Test cases for retrieving products
describe('POST /homepage', () => {
    it('should retrieve product details', async () => {
        const productData = generateRandomProductData();

        await Product.create(productData);

        const response = await request(app)
            .post('/homepage')
            .send({ product: productData.name });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', productData.name);
        expect(response.body).toHaveProperty('description', productData.description);
        expect(response.body).toHaveProperty('price', productData.price);
    });

    it('should return an error if product does not exist', async () => {
        const nonExistingProduct = 'Non Existing Product';

        const response = await request(app)
            .post('/homepage')
            .send({ product: nonExistingProduct });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Product does not exist');
    });
});

// Function to generate random order data
const generateRandomOrderData = () => {
    return {
        product: 'Test Product',
        price: 10,
        quantity: 2,
        cartId: 'testCartId',
        email: 'test@example.com',
    };
};

module.exports = app; // Export the Express app for testing purposes
