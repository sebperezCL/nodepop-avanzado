'use strict';

const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
  name: { type: String, index: true},
  sell: Boolean,
  price: { type: Number, index: true},
  currency: String,
  picture: String,
  tags: [String]
},
{
  autoIndex: process.env.NODE_ENV !== 'production'
}
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;
