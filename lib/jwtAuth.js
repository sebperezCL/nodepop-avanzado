'use strict';
const createError = require('http-errors');

// función que devuelve un middleware de autenticación con JWT

const jwt = require('jsonwebtoken');

module.exports = function() {
  return (req, res, next) => {
    // comprobar que tenemos una cabecera Authorization con un JWT válido

    // recoger el token
    const tokenJWT = req.get('Authorization') || req.query.token || req.body.token;

    // si no nos dan token no permitimos pasar
    if (!tokenJWT) {
      return next(createError(401, 'no token provided'));
    }

    // verificar el token
    jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
      if (err) return next(createError(401, 'invalid token'));
      req.apiAuthUserId = payload._id;
      next();
    });

  };
};