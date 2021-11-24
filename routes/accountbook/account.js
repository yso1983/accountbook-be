const db = require('@mariadb');
const query = require('@query/account.js');
const express = require('express');
const logger = require('@root/winston')
const router = express.Router();

/* GET listing. */
router.get('/', function(req, res, next) {
  //logger.info(req);
  db.query(query.select, function(err, result){
    if(err){
      logger.error(err);
    }
    res.json(result);
  });
});

/* PUT ITEM */
router.put('/', function(req, res, next) {

  let data = req.body;
  let sql = '', params = [];

  logger.info(req.body);

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.json(0);
  }
  else{
    params = [parseInt(data.user_id), data.name, parseInt(data.amount), data.remark];
    if(data.id == '0'){
      sql = query.insert;
    }
    else{
      sql = query.update;
      params.push(parseInt(data.id));
    }

    db.query(sql, params,function(err,rows,fields) {
      if(err){
        logger.error(err);
        res.json(0);
      }else{
        res.json(fields);
      }
    });
  }
});

module.exports = router;