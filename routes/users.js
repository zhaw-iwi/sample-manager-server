var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({hello: 'myName', whatsapp: 'thefuck'});
});

router.get('/:id', function(req, res, next) {
  res.send({id: req.params.id});
});

module.exports = router;