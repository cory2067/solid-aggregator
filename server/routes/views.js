const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send("nothing to see here");
});

module.exports = router;
