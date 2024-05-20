const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    product: String,
    price: Number,
    quantity: Number,
    cartId: String,
    email: String,
    //order_id: String,
    //user_id: String,
    //products: Array,
    //total_price: Number,
    //order_date: Date,
    //status: String,
    //availability: String
}, { versionKey: false });

const Order = mongoose.model('Order', orderSchema)

module.exports = Order