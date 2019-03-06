const express = require('express');
const multer = require('multer');
const seal = require('../sealjs');
const shell = require('shelljs');
const path = require('path');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.post('/submit', upload.single('data'), (req, res) => {
  console.log("Somebody submitted data!");
  console.log(req.file);
  console.log(req.body);
  res.send("ok!");
});

router.get('/aggregate', (req, res) => {
  /*if (!req.fn) {
    return res.code(400).send("No aggregation function given");
  }*/

  const files = [
    '06c57fad2ce817610cad566209ccef44',
    '836a8c54a60bb0acde1af859f0c90ab8',
    '60c8e44b972c0f9f32db0e932e0b861d',
    'a4ada003e2ecf2486c8300995b8d46de'
  ];

  const context = new seal.SEALContext(2048, 128, 65536);
  const evaluator = new seal.Evaluator(context);

  const ciphers = files.map((file) => {
    shell.exec(resolvePath('.', 'decrypt') + ' uploads/' + file);
    return new seal.Ciphertext(resolvePath('uploads', file + '.seal'));
  });

  const sum = ciphers[0];
  for (let i = 1; i < ciphers.length; i++) {
    evaluator.addInPlace(sum, ciphers[i]);
  }

  sum.save(resolvePath('uploads', 'tmp.seal'));
  res.sendFile(resolvePath('uploads', 'tmp.seal'));
});

function resolvePath(dir, filename) {
  return path.resolve(path.join(__dirname, '..', dir, filename));
}

module.exports = router;
