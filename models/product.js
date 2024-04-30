const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id: String,
    availability: String,
    price: Number,
    product: String,
    quantity: Number

})

const Product = mongoose.model('Product', productSchema)

module.exports = Product