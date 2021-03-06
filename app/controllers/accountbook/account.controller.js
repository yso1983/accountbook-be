const db = require("@db");
const Account = db.account;
const User = db.user;
const logger = require('@winston');
const { success, failure } = require('@utils').responseJson;
const commFunc =  require('@utils').commFunc;

function fn_findAllCondition(req){
  if(req.query.userid){
    return {
     include: [
        {
          model: User,
          required: true,
          attributes: ['name'],
          //where: ["year_birth = post_year"]
        }
      ],
      where: {
        user_id: req.query.userid,
        group_id: req.groupId
      }
     };
  }else{
    return {
     include: [
        {
          model: User,
          required: true,
          attributes: ['name'],
          //where: ["year_birth = post_year"]
        }
      ],
      where: {
        group_id: req.groupId
      }
    };
  }
}

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  Account.findAll(fn_findAllCondition(req))
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


// Update a Tutorial by the id in the request
exports.update = (req, res) => {

  let data = req.body;

  if(!data || data.id == undefined){
    logger.error('undefined : id');
    res.status(200).json(failure("9001", "undefined id"));
  }
  else{

    let params = { user_id: req.userId, name: data.name, amount: commFunc.parseFloat(data.amount), remark: data.remark, group_id: req.groupId };

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