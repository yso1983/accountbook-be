const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@middleware').responseJson;
const { upsert } = require('@middleware').sequelizeUtil;
const moment = require('moment-timezone');

const Automatic = db.automaticDnw;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  let params = { 
    account_id: req.body.account_id, 
    dnw_item_id: req.body.dnw_item_id, 
    created_user_id: req.body.user_id, 
    amount: parseFloat(req.body.amount), 
    day: parseFloat(req.body.day)
  };
  
  upsert(Automatic, params, { id: req.body.id })
    .then(result => {
       res.status(200).send(success(result));
    })
    .catch(err => res.status(401).send(failure("9999", err.message)));
};

exports.findAll = (req, res) => {

  Automatic.findAll({
     include: [
        {
          model: db.account,
          required: true,
          attributes: ['name'],
          include: [
            {
              model: db.user,
              required: true,
              attributes: ['name'],
            },
          ]
        },
        {
          model: db.dnwItem,
          required: true,
          attributes: ['name'],
        },
     ]
  })
  .then(result => {
    if (!result) {
      return res.status(404).send({ message: "Not found." });
    }
    res.status(200).send(success(result));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

exports.delete = (req, res) => {
  
  Automatic.destroy({
    where: { 
        id : req.params.id
      }
  })
  .then(result => {
      res.status(200).send(success(result));
  })
  .catch(err => res.status(401).send(failure("9999", err.message)));

};

