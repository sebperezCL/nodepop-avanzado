'use strict';

require('dotenv').config();

const readline = require('readline');
const conn = require('./lib/connectMongoose');
const Advertisement = require('./models/Advertisement');
const User = require('./models/User');

conn.once('open', async () => {
  try {

    const respuesta = await askUser('Está seguro que quiere crear la BD con anuncios iniciales? (si/no)');

    if (respuesta.toLowerCase() !== 'si') {
      console.log('Proceso cancelado');
      return process.exit(0);
    }

    await initAdvertisements();
    await initUsuarios();

    conn.close();

  } catch (err) {
    console.log('Error al crear los datos:', err);
    process.exit(1);
  }

});

async function initAdvertisements() {
  await Advertisement.deleteMany();
  console.log('Colección de anuncios eliminada ...');
  // cargar información inicial desde fichero
  console.log('Cargando anuncios desde ads.json ...');
  const data = require('./ads.json');
  const result = await Advertisement.insertMany(data.advertisements);
  console.log(`Se han creado ${result.length} avisos.`);
}

async function initUsuarios() {
  // Borramos la colección de usuarios en la db (si existe)
  await User.deleteMany();
  console.log('Colección de usuarios eliminada...');

  // cargar los documentos iniciales
  console.log('Cargando usuarios...');
  const result = await User.insertMany([
    { email: 'user@example.com', password: await User.hashPassword('1234') },
    { email: 'sebperez@gmail.com', password: await User.hashPassword('1234') },
  ]);
  console.log(`Se han creado ${result.length} usuarios.`);
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