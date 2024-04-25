const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_id: String,
    user_id: String,
    products: Array,
    price: Number,
    total_price: Number,
    order_date: Date,
    status: String
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order