const express = require('express');
const logger = require('@winston')

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/kakao', function(req, res, next) {
  res.render('kakao', { title: 'kakao' });
});

module.exports = router;
