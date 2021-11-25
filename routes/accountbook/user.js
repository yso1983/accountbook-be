const db = require('@mariadb');
const accountSql = require('@query/account.js');
const express = require('express');
const logger = require('@root/winston')
const { success, failure } = require('@common/result')
const router = express.Router();

/* GET listing. */
router.get('/', function(req, res, next) {
  //logger.info(req);
  db.query(accountSql.selectUsers, function(err, result){
    if(err){
      logger.error(err);
      res.json(failure("9001", err));
    }
    else{
      res.json(success(result));
    }
  });
});

module.exports = router;