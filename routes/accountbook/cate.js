const db = require('@mariadb');
const cateQuery = require('@query/cate.js');
const express = require('express');
const logger = require('@root/winston')
const router = express.Router();

/* GET items listing. */
router.get('/', function(req, res, next) {
  //logger.info(req);
  db.query(cateQuery.select, function(err, result){
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
  console.log(data);

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.json(0);
    
  }
  else {
    if(data.id == '0'){
      sql = cateQuery.insert;
      params = [parseInt(data.gubun), data.name, data.remark];
    }
    else{
      sql = cateQuery.update;
      params = [parseInt(data.gubun), data.name, data.remark, parseInt(data.id)];
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