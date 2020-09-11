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
/* Entrega todos los anuncios disponibles */
router.get('/', async function(req, res, next) {
  try {
    const ads = await Advertisement.find().select('-__v');
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
/* Entrega todos los anuncios disponibles */
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