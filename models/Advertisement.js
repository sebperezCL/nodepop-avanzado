'use strict';

const mongoose = require('mongoose');

/* Creamos el esquema para los anuncios, incluyendo las validaciones necesarias */
const advertisementSchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: [true, 'Field cannot be empty']
  },
  sell: {
    type: Boolean,
    required: [true, 'Field should be a boolean value (true to sell or false to buy)']
  },
  price: {
    type: Number,
    index: true,
    required: [true, 'Field cannot be empty'],
    min: 0
  },
  currency: {
    type: String,
    required: [true, 'Field cannot be empty'],
    enum: {
      values: ['USD', 'EUR', 'CLP'],
      message: 'Valid values are only USD, EUR or CLP'
    }
  },
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

advertisementSchema.statics.lista = function(filter, limit, skip, sort, fields) {
  const query = Advertisement.find(filter);
  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;
