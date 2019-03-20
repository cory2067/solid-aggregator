const express = require('express');
const multer = require('multer');
const seal = require('../sealjs');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const mongo = require('../db');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const upload = multer({ dest: 'tmp/' });

// handle user submit encrypted data
router.post('/submit', upload.single('data'), async (req, res) => {
  const records = mongo.getDb().collection('records');
  console.log("Somebody submitted data!");
  console.log(req.file);
  console.log(req.body);
  console.log(process.cwd())
  shell.exec(resolvePath('.', 'decrypt') + ' ' + req.file.filename);

  const entry = {
    timestamp: new Date(),
    study: req.body.study,
    valuePath: resolvePath('uploads', req.file.filename + "-V.seal"),
    filterPath: resolvePath('uploads', req.file.filename + "-F.seal"),
  };
  
  records.insertOne(entry)
    .then(result => {
      res.send("ok!");
    });
});

router.post('/study', bodyParser.json(), (req, res) => {
  const studies = mongo.getDb().collection('studies');
  studies.insertOne(req.body)
    .then(result => {
      res.send("ok!");
    });
});

router.get('/studies', (req, res) => {
  const studies = mongo.getDb().collection('studies');
  const query = {};
  if (req.query.webid) {
    query.webId = req.query.webid;
  }

  studies.find(query).toArray()
    .then(studies => {
      res.send(studies);
    });
});

router.get('/aggregate', (req, res) => {
  const studies = mongo.getDb().collection('studies');
  /*if (!req.fn) {
    return res.code(400).send("No aggregation function given");
  }*/

  console.log(req.query);
  if (!req.query.study) {
    return res.status(400).send("No study id provided");
  }

  console.log("ree");
  studies.findOne({_id: ObjectId(req.query.study)})
    .then(study => {
      console.log(study);
      res.send(study);
    });

  return;// res.send("ok");

  const hrstart = process.hrtime(); // measure performance
  const files = fs.readdirSync(resolvePath('uploads', ''));
  const context = new seal.SEALContext(2048, 128, 65536);
  const evaluator = new seal.Evaluator(context);

  console.log("loading ciphertext");
  const ciphers = files.map((file) => {
    return new seal.Ciphertext(resolvePath('uploads', file));
  });

  // no ciphertext what do
  if (!ciphers.length) return res.send("");

  console.log("aggregating " + ciphers.length + " users");
  const sum = ciphers[0];
  for (let i = 1; i < ciphers.length; i++) {
    evaluator.addInPlace(sum, ciphers[1]);
  }
  console.log("aggregation complete");

  sum.save(resolvePath('tmp', 'out.seal'));

  const hrend = process.hrtime(hrstart);
  console.log('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
  res.sendFile(resolvePath('tmp', 'out.seal'));
});

function resolvePath(dir, filename) {
  return path.resolve(path.join(__dirname, '..', dir, filename));
}

module.exports = router;
