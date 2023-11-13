const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  unitsSold: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('PRODUCT', productSchema);