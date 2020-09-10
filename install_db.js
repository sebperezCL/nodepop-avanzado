'use strict';

require('dotenv').config();

const readline = require('readline');
const conn = require('./lib/connectMongoose');
const Advertisement = require('./models/Advertisement');
const fs = require('fs');


conn.once('open', async () => {
  try {

    const respuesta = await askUser('Está seguro que quiere crear la BD con anuncios iniciales? (si/no)');

    if (respuesta.toLowerCase() !== 'si') {
      console.log('Proceso cancelado');
      return process.exit(0);
    }

    await initAdvertisements();

    conn.close();

  } catch (err) {
    console.log('Error al crear los datos:', err);
    process.exit(1);
  }

});

async function initAdvertisements() {
  await Advertisement.deleteMany();
  console.log('Colección de anuncios eliminada...');
  // cargar los documentos iniciales
  console.log('Cargando agentes...');
  const result = await Advertisement.insertMany([
    { name: 'Smith', age: 36 },
    { name: 'Brown', age: 19 }
  ]);
  console.log(`Se han creado ${result.length} avisos.`);
}


function askUser(textoPregunta) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(textoPregunta, answer => {
      rl.close();
      resolve(answer);
    });
  });
}