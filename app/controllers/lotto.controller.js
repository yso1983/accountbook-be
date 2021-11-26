const db = require('@mariadb');
const query = require('@query/lotto.js');
const logger = require('@winston')

exports.findAll = (req, res) => {
  
  db.query(query.select, function(err, result){
    if(err){
      logger.error(err);
    }
    res.json(result);
  });

};