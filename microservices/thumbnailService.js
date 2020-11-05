'use strict';

const cote = require('cote');
const jimp = require('jimp');
const path = require('path');
const responder = new cote.Responder({ name: 'Thumbnail Service'});

responder.on('thumbnail create', async (req, done) => {
  console.log(`Create thumbnail: Filename: ${req.filename} - Size: ${req.size} - Timestamp: ${Date.now()}`);

  let resultado = '';
  if(await imgToThumb(req.filename, parseInt(req.size))) {
    resultado = 'Redimensión exitosa';
  } else {
    resultado = 'Error al redimensionar';
  }
  done(resultado);
});


async function imgToThumb(filename, size) {
  try {
    const imgpath = path.join(__dirname, '/../public', 'images');
    const image = await jimp.read(path.join(imgpath, 'fullsize', filename));

    await image.resize(size, jimp.AUTO);

    await image.writeAsync(path.join(imgpath, 'thumbs', filename));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

