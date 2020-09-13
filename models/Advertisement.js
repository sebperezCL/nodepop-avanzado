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

advertisementSchema.statics.lista = function(req) {
  // recibimos el objeto req desde el router, toda esta lógica la ubiqué en el modelo
  // para poder reutilizarla cuando es llamada desde la vista index
  const filter = {};
  if(req.query.name) {
    // Uso expresiones regulares para hacer un filtro "like" con la opción 'i' que no sea case sensitive
    filter.name = new RegExp('^' + req.query.name,'i');
  }

  if(req.query.sell) {
    filter.sell = req.query.sell;
  }

  if(req.query.tag) {
    filter.tags = { $all: req.query.tag }; //busca 1 o más tags en los anuncios disponibles
  }

  if(req.query.currency) {
    filter.currency = req.query.currency.toUpperCase();
  }

  // Verifico si viene el parámetro price
  if(req.query.price) {

    if(req.query.price.match(/^-?\d+$/)) {
      // tipo number o -number
      const valor = Number(req.query.price);
      if(valor < 0) {
        filter.price = { $lte: Math.abs(valor) }; // Busco los precios menores al indicado
      } else {
        filter.price = req.query.price; // Busco el precio exacto
      }
    }

    if(req.query.price.match(/^\d+-$/)) {
      // tipo number-
      filter.price = { $gte: parseInt(req.query.price) };
    }

    if(req.query.price.match(/^-?\d+-\d+$/)) {
      // tipo number-number
      const priceArray = req.query.price.split('-');
      filter.price = { $gte: priceArray[0], $lte: priceArray[1] };
    }

    if(!filter.price) {
      // si viene el parámetro pero no coincidió con nada entonces viene mal formateado
      return { error:
        {
          code: 400,
          message: 'Price parameter should be like `int1` or `int1-int2` or `-int1` or `int1-`'
        }
      };
    }
  }

  const limit = parseInt(req.query.limit || 15);
  const start = parseInt(req.query.start);
  const sort = req.query.sort;


  const query = Advertisement.find(filter);
  query.limit(limit);
  query.skip(start);
  query.sort(sort);
  query.select('-__v');
  return query.exec();
};

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;
