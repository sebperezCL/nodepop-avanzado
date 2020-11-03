const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
  // Recogemos los valores entregados para el login
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password) {
    return next(createError(401, 'credentials not provided'));
  }

  // Buscar al usuario en la db
  const user = await User.findOne({ email: email });

  //validar usuario y password
  if(!user || !(await bcrypt.compare(password, user.password ))) {
    return next(createError(401, 'invalid Credentials'));
  }

  // Crear JWT
  jwt.sign({ _id: user._id, email: email }, process.env.JWT_SECRET, { expiresIn: '2s'}, (err, tokenJWT) => {
    if (err) return next(err);
    // Enviar el JWT
    res.json({ tokenJWT: tokenJWT });
    return;
  });
});

module.exports = router;