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

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.send(0);
  }
  
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
      res.send(0);
    }else{
      res.send(fields);
    }
  });
});

module.exports = router;