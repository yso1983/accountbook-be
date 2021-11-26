const controller = require('@controllers/accountbook/account.controller.js');
const router = require('express').Router();

/* GET listing. */
router.get('/', function(req, res, next) {
  controller.findAll(req, res);
});

/* PUT ITEM */
router.put('/', function(req, res, next) {
  controller.update(req, res);
});

module.exports = router;