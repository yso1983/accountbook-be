const db = require('@mariadb');
const accountSql = require('@query/account.js');
const express = require('express');
const logger = require('@root/winston')
const router = express.Router();

/* GET listing. */
router.get('/', function(req, res, next) {
  //logger.info(req);
  db.query(accountSql.selectUsers, function(err, result){
    if(err){
      logger.error(err);
    }
    res.json(result);
  });
});

module.exports = router;