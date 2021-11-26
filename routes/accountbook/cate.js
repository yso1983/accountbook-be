const controller = require('@controllers/accountbook/cate.controller.js');
const router = require('express').Router();

/* GET items listing. */
router.get('/', function(req, res, next) {
  controller.findAll(req, res);  
});

/* PUT ITEM */
router.put('/', function(req, res, next) {
  controller.update(req, ers);
});

module.exports = router;