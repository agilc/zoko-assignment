const Joi = require('joi');
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required:true },
  description: String,
  imageUrl: String,
  price: Number,
  tags: [String ],
  color: Object
}));

function validateProduct(product) {
  const schema = {
    name: Joi.string().required().min(3).max(30), 
    description: Joi.string().max(200),
    imageUrl: Joi.string(),
    price: Joi.number(),
    tags: Joi.string(),
    color: Joi.string(),
    _id: Joi.string()
  };

  return Joi.validate(product, schema);
}

exports.Products = Product; 
exports.validate = validateProduct;