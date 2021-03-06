const express = require('express');
const multer = require('multer');
const seal = require('../sealjs');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const mongo = require('../db');
const aggregation = require('../aggregation');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const upload = multer({ dest: 'tmp/' });

// handle user submit encrypted data
router.post('/submit', upload.single('data'), async (req, res) => {
  const records = mongo.getDb().collection('records');
  console.log("Somebody submitted data!");
  console.log(req.body);

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

// Register a new study
router.post('/study', bodyParser.json(), (req, res) => {
  const studies = mongo.getDb().collection('studies');
  studies.insertOne(req.body)
    .then(result => {
      res.send("ok!");
    });
});

// Get all studies, or all studies that match a given webId
router.get('/studies', (req, res) => {
  console.log(req.query);
  const studies = mongo.getDb().collection('studies');
  const query = {};
  if (req.query.webid) {
    query.webId = req.query.webid;
  }

  studies.find(query).toArray()
    .then(studies => {
      console.log(studies);
      res.send(studies);
    });
});

// Compute an aggregate (must specify a studyId)
// returns the URI of the numerator and (possibly) denominator of the
// aggregation
router.get('/aggregate', async (req, res) => {
  const studies = mongo.getDb().collection('studies');
  const records = mongo.getDb().collection('records');

  console.log(req.query);
  if (!req.query.study) {
    return res.status(400).send("No study id provided");
  }

  // fetch rest of data for this study
  const study = await studies.findOne({_id: ObjectId(req.query.study)});
  if (!study) {
    return res.status(400).send("Nonexistent study");
  }

  // fetch metadata for all records for this study
  // todo: handle this in more scalable way
  const data = await records.find({study: req.query.study}).toArray();
  console.log("Aggregating " + data.length + " records");

  const hrstart = process.hrtime(); // measure performance
  console.log("loading ciphertext");
 
  const valueCiphers = data.map((record) => {
    return new seal.Ciphertext(record.valuePath);
  });

  const filterCiphers = data.map((record) => {
    return new seal.Ciphertext(record.filterPath);
  });

  // no results what do...
  if (!valueCiphers.length) return res.send({});

  const funcStr = study.function.split('(')[0];
  console.log("Computing: " + funcStr);
  const funcs = {
    sum:      aggregation.sum,
    count:    aggregation.count,
    average:  aggregation.average,
    ratio:    aggregation.average, // alias
    variance: aggregation.variance,
  };

  // do the actual homomorphic aggregation here
  const result = funcs[funcStr](valueCiphers, filterCiphers);
  
  const hrend = process.hrtime(hrstart);
  console.log("aggregation complete");
  console.log('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
  
  // save all results to filesystem
  const numPath = req.query.study + '-num.seal';
  result.numerator.save(resolvePath('tmp', numPath));
  
  if (!result.denominator) {
    return res.send({
      numerator: '/api/results/' + numPath
    });
  }

  const denPath = req.query.study + '-den.seal';
  result.denominator.save(resolvePath('tmp', denPath));

  return res.send({
    numerator: '/api/results/' + numPath,
    denominator: '/api/results/' + denPath
  });
});

// fetch the actual results, using the URI specified by calling /aggregate
// returns encrypted ciphertext that can only be decrypted by the researcher
router.get('/results/:path', async (req, res) => {
  const path = resolvePath('tmp', req.params.path); 

  res.sendFile(path);
  // todo: should this delete resource afterward?
});

function resolvePath(dir, filename) {
  return path.resolve(path.join(__dirname, '..', dir, filename));
}

module.exports = router;
