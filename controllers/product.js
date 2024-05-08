const productRouter = require('express').Router()
const Product = require('../models/product');
//route for retrieving products
productRouter.post('/homepage', (req, res) => {
    // Check if product exists
    Product.findOne({ product: req.body.product })
        .then(product => {
            if (!product) {
                res.status(400).send('Product does not exist');
            } else {
                // Send a response with the product details
                res.status(200).json(product);
                
            }
        })
        .catch(err => {
            res.status(500).send('Server error');
        });
});

module.exports = productRouter