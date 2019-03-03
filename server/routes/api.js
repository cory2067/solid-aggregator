const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.post('/submit', upload.single('data'), (req, res) => {
    console.log("Somebody submitted data!");
    console.log(req.body);
    res.send("ok!");
});

module.exports = router;
