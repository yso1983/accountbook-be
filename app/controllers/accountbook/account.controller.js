const db = require("@db");
const Account = db.account;
const User = db.user;
const logger = require('@winston');
const { success, failure } = require('@responseJson');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  Account.findAll({
     include: [
        {
          model: User,
          required: true,
          attributes: ['username'],
          //where: ["year_birth = post_year"]
        }
     ],
  })
  .then(result => {
    if (!result) {
      return res.status(404).send({ message: "User Not found." });
    }
    res.status(200).send(success(result));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

  let data = req.body;

  console.log(data);

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.status(200).json(failure("9001", "undefined id"));
  }
  else{

    let params = { user_id: data.user_id, name: data.name, amount: data.amount, remark: data.remark };

    if(data.id == '0'){
      Account.create(params)
      .then(account => {
        if (!account) {
          return res.status(404).send({ message: "Account Not found." });
        }
        res.status(200).send(success(account));
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
    }
    else{
      Account.update(params, {where: { id: data.id }})
      .then(account => {
        if (!account) {
          return res.status(404).send({ message: "Account Not found." });
        }
        res.status(200).send(success(account));
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
    }

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