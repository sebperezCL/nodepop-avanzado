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
        next(createError(400, 'Price parameter should be like `int1` or `int1-int2` or `-int1` or `int1-`'));
        return;
      }
    }


    /*
    if(req.query.price) {
      // Luego verifico si es un número
      if(Number(req.query.price)){

        /** Si es número hay dos posibilidades, si es negativo entonces
         * debo buscar los precios menores al indicado en el parámetro
         * si es un número positivo entonces hay que buscar el precio exacto

        const valor = Number(req.query.price);
        if(valor < 0) {
          console.log(valor);
          filter.price = { $lte: Math.abs(valor) }; // Busco los precios menores al indicado
        } else {
          filter.price = req.query.price; // Busco el precio exacto
        }

      } else {
        const priceArray = req.query.price.split('-'); // Si no es número busco si hay un guión
        if(priceArray.length === 2) { // Si se cumple esta condición entonces el parámetro tiene un guión a la derecha
          if(Number(priceArray[0])) {
            filter.price = { $gte: Math.abs(priceArray[0]) };
          } else {
            next(createError(400, 'Price parameter should be like `number1` or `number1-number2` or `-number1` or `number1-`'));
            return;
          }
        } else {
          next(createError(400, 'Price parameter should be like `number1` or `number1-number2` or `-number1` or `number1-`'));
          return;
        }
      }
    }*/

    //console.log(filter);
    const ads = await Advertisement.find(filter).select('-__v');
    const result = {
      count: ads.length,
      advertisements: ads
    };
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/* GET /api/ads */
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
      currency: req.body.currency,
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

module.exports = router;