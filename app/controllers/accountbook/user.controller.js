const db = require('@mariadb');
const query = require('@query/user.js');
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
      res.json(failure("9001", err));
    }
    else{
      res.json(success(result));
    }
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

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