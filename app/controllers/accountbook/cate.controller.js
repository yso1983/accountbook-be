const db = require('@mariadb');
const query = require('@query/cate.js');
const logger = require('@winston');
const { success, failure } = require('@common/result');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  db.query(query.select, function(err, result){
    if(err){
      logger.error(err);
    }
    res.json(result);
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  let data = req.body;
  let sql = '', params = [];
  console.log(data);

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.json(0);
    
  }
  else {
    if(data.id == '0'){
      sql = query.insert;
      params = [parseInt(data.gubun), data.name, data.remark];
    }
    else{
      sql = query.update;
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
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  
};