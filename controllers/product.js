const productRouter = require('express').Router();
const Product = require('../models/product');

// Route for retrieving products
productRouter.post('/homepage', (req, res) => {
    Product.findOne({ product: req.body.product })
        .then(product => {
            if (!product) {
                res.status(400).send('Product does not exist');
            } else {
                res.status(200).json(product);
            }
        })
        .catch(err => {
            res.status(500).send('Server error');
        });
});

// Route for adding new product
productRouter.post('/addProduct', (req, res) => {
    const newProduct = new Product({
        product: req.body.product,
        id: req.body.sku,
        quantity: req.body.quantity,
        price: req.body.price.selling,
        availability: 'In Stock'
    });

    newProduct.save()
        .then(() => res.status(201).json('Product added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route for retrieving all products
productRouter.get('/products', (req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = productRouter;
