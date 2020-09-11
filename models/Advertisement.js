'use strict';

const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: [true, 'Cannot be empty']
  },
  sell: Boolean,
  price: { type: Number, index: true},
  currency: String,
  picture: String,
  tags: {
    type: [String],
    validate: {
      validator: (v) => { return v.length > 0; },
      message: 'The advertisement must include at least one tag'
    }
  }
},
{
  autoIndex: process.env.NODE_ENV !== 'production'
}
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;
