const express = require('express');
const multer = require('multer');
const router = express.Router();
const Advertisement = require('../../models/Advertisement');
const createError = require('http-errors');
const { Mongoose } = require('mongoose');
//const { response } = require('../../app');

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

router.get('/', async function(req, res, next) {
  try {
    const ads = await Advertisment.find();
    res.json({ results: ads });
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

    await ad.save((error, ad) => {
      if(!error) {
        res.json(ad);
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