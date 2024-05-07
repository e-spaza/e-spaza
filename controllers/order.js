const orderRouter = require('express').Router()
const Order = require('../models/order');

orderRouter.post('/placeOrder', (req, res) => {
  // Create a new order
  const newOrder = new Order({
    product: req.body.product,
    price: req.body.price,
    quantity: req.body.quantity,
    //order_id: req.body.orderId,
    //user_id: req.body.userId,
    //total_price: req.body.totalPrice,
    //order_date: req.body.orderDate,
    //status: req.body.status,
    //availability: req.body.availability
  });

  // Save the order to the database
  newOrder.save()
    .then(() => res.json('Order placed!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = orderRouter;