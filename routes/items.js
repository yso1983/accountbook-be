const db = require('../db/mariadb');
const http = require('http');
const express = require('express');
const router = express.Router();

/* GET items listing. */
router.get('/', function(req, res, next) {
  db.query(`select * from cate`, function(error, result){
    console.log(result);
    res.json(result);
  });
});

router.put('/', function(req, res, next) {

  console.log(req.body);

  var data = req.body;

  if(!data)
    res.send(0);

  var sql = 'INSERT INTO cate(id, gubun, name, remark)VALUES((select ifnull(max(id), 0) + 1 from cate ALIAS_FOR_SUBQUERY),?,?, ?)';

  var params = [parseInt(data.gubun), data.name, data.remark];

  db.query(sql, params,function(err,rows,fields) {
    if(err){
      console.log(err);
    }else{
      console.log(rows.insertId);
    }

    res.send(fields);
  });
});

module.exports = router;