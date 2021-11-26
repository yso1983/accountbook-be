const controller = require('@controllers/accountbook/dnw.controller.js');
const router = require('express').Router();

/* GET listing. */
router.get('/', function(req, res, next) {
  controller.findAll(req, res);
});

module.exports = router;