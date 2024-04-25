const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    catagory: String,
    brand: String,
    quantity: Number,
    image: String

})

const Product = mongoose.model('Product', productSchema)

module.exports = Product