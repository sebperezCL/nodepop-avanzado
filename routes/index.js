var express = require('express');
var router = express.Router();
const Advertisement = require('../models/Advertisement');
const createError = require('http-errors');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const params = {
      name: req.query.name,
      sell: req.query.sell,
      tag: req.query.tag,
      currency: req.query.currency,
      price: req.query.price,
      limit: req.query.limit,
      start: req.query.start,
      sort: req.query.sort
    };
    const ads = await Advertisement.lista(params);
    if(ads.error) {
      next(createError(ads.errr.code, ads.error.message));
    }

    const result = {
      count: ads.length,
      advertisements: ads
    };

    res.locals.ads = result;

  } catch (error) {
    next(error);
  }
  res.render('index', { title: 'Buscador de anuncios' });
});

module.exports = router;
