const express = require('express');
//const multer = require('multer');
const router = express.Router();
const Advertisment = require('../../models/Advertisement');

/* GET /api/ads */

router.get('/', async function(req, res, next) {
  try {
    let ads = await Advertisment.find();
    res.json(ads);
  } catch (error) {
    next(error);
  }
});

module.exports = router;