// ./controllers/report.js
const reportRouter = require('express').Router();
const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');

// Serve the reports.html file
reportRouter.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/reports.html'));
});

// Fetch stock data
reportRouter.get('/api/stock', (req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(500).json('Server error'));
});

// Fetch order history
reportRouter.get('/api/orders', (req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => res.status(500).json('Server error'));
});

module.exports = reportRouter;