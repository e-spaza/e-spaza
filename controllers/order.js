const orderRouter = require('express').Router();
const Order = require('../models/order');

// Route for placing an order
orderRouter.post('/placeOrder', (req, res) => {
    const newOrder = new Order({
        product: req.body.product,
        price: req.body.price,
        quantity: req.body.quantity,
        cartId: req.body.cartId,
        status: 'Pending'
    });

    newOrder.save()
        .then(() => res.json('Order placed!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route for fulfilling an order
orderRouter.post('/fulfillOrder', (req, res) => {
    Order.findByIdAndUpdate(req.body.orderId, { status: 'Fulfilled' })
        .then(() => res.json('Order fulfilled!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route for retrieving all orders
orderRouter.get('/orders', (req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = orderRouter;
