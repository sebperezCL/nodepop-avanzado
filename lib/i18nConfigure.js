'use strict';

const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'langs'),
  defaultLocale: 'en',
  autoReload: true, // recargar ficheros de idioma si cambian
  syncFiles: true, // crear literales en todos los idiomas a la vez
  cookie: 'nodeapi-lang',
});

module.exports = i18n;