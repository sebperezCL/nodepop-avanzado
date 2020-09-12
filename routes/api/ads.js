const express = require('express');
const multer = require('multer');
const router = express.Router();
const Advertisement = require('../../models/Advertisement');
const createError = require('http-errors');
const { Mongoose } = require('mongoose');

const storage = multer.diskStorage({
  destination: function( req, file, cb ) {
    cb(null, 'public/images/');
  },
  filename: function(req, file, cb) {
    const myFileName = `${Date.now()}_${file.originalname}`;
    cb(null, myFileName);
  }
});

const upload = multer({ storage: storage});

/* GET /api/ads */
/* Entrega todos los anuncios disponibles que cumplan los criterios de búsqueda
* y con las opciones limit, start y sort */
router.get('/', async function(req, res, next) {
  try {
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
        next(createError(400, 'Price parameter should be like `int1` or `int1-int2` or `-int1` or `int1-`'));
        return;
      }
    }

    const limit = parseInt(req.query.limit || 15);
    const skip = parseInt(req.query.skip);
    const sort = req.query.sort;

    const ads = await Advertisement.lista(filter, limit, skip, sort);
    const result = {
      count: ads.length,
      advertisements: ads
    };
    res.json(result);

  } catch (error) {
    next(error);
  }
});

/* GET /api/ads/:_id */
/* Entrega el anuncio disponible con el id indicado */
router.get('/:_id', async function(req, res, next) {
  try {
    const _id = req.params._id;
    const ads = await Advertisement.findOne({ _id: _id}).select('-__v');
    const result = { advertisement: ads };
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/* POST /api/ads */
/* Acá recibimos un nuevo anuncio para ser guardado en la db */
router.post('/', upload.single('picture'), async function (req, res, next) {
  try {
    const file = req.file;

    /* Creamos un nuevo anuncio usando el modelo, lo hacemos campo por campo
    para evitar que se introduzcan campos adicionales que no pertenecen
    al schema */
    const ad = new Advertisement({
      name: req.body.name,
      sell: req.body.sell,
      price: req.body.price,
      currency: req.body.currency.toUpperCase(),
      picture: file.filename,
      tags: req.body.tags
    });

    /* La función save retorna un error si hay algún problema con la validación
    contra el schema, el error es manejado por el error handler con código 400.
    En caso contrario (éxito) retorna el json del documento recién guardado */
    await ad.save((error, ad) => {
      if(!error) {
        res.json({result: ad});
      } else {
        next(createError(400, error.message));
        return;
      }
    });

  } catch (error) {
    next(error);
  }
});

/* DELETE /api/ads/:_id */
/* Borra el anuncio indicado en el id */
router.delete('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;

    await Advertisement.deleteOne({ _id: _id });

    res.json({
      deleted: {
        status: 'Success',
        id: _id
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;