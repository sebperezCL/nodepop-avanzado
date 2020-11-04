const express = require('express');
const router = express.Router();

/* GET /change-locale/:locale */
router.get('/:lang', function(req, res, next) {
  // recuperar el locale que nos pasan
  const lang = req.params.lang;
  
  // guardar la página de donde venía el usuario
  const volverA = req.get('referer');
  console.log(volverA);
  // establecer la cookie en la respuesta con el nuevo locale
  res.cookie('nodeapi-lang', lang, { maxAge: 1000 * 60 * 60 * 24 * 20 });

  // redirigir al usuario a donde venía
  res.redirect(volverA);
});

module.exports = router;
