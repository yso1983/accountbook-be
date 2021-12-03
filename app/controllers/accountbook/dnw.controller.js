const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@middleware').responseJson;
const { upsert } = require('@middleware').sequelizeUtil;
const DnwItem = db.dnwItem;
const DnwDetail = db.dnwDetail;
const moment = require('moment-timezone');

const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.createItem = (req, res) => {

  upsert(DnwItem, { name: req.body.name, remark: req.body.remark  }, { id: req.body.id })
    .then(result => {
       res.status(200).send(success(result));
    })
    .catch(err => res.status(401).send(failure("9999", err.message)));
};

// Retrieve all Tutorials from the database.
exports.findAllItem = (req, res) => {
  DnwItem.findAll()
  .then(items => {
    if (!items) {
      return res.status(404).send({ message: "Item Not found." });
    }
    res.status(200).send(success(items));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

exports.findAllDetails = (req, res) => {
  DnwDetail.findAll({
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
          model: DnwItem,
          required: true,
          attributes: ['name'],
        },
     ],
  })
  .then(details => {
    if (!details) {
      return res.status(404).send({ message: "Not found." });
    }
    res.status(200).send(success(details));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};

exports.createDetail = (req, res) => {
  let params = { 
    account_id: req.body.account_id, 
    dnw_item_id: req.body.dnw_item_id, 
    created_user_id: req.body.user_id, 
    amount: req.body.amount, 
    standard_dt: req.body.standard_dt, 
    remark: req.body.remark  
  };

  upsert(DnwDetail, params, { id: req.body.id })
    .then(result => {
       res.status(200).send(success(result));
    })
    .catch(err => res.status(401).send(failure("9999", err.message)));
};

exports.findDetailsByMonth = (req, res) => {
  let startDt = moment(new Date(req.params.month.replace('-', '').substring(0, 4), (parseInt(req.params.month.replace('-', '').substring(4)) - 1), 1, 0, 0, 0))
    .tz('Asia/Seoul').format();
  let endDt = moment(new Date(req.params.month.replace('-', '').substring(0, 4), (req.params.month.replace('-', '').substring(4)), 1, 0, 0, 0))
    .tz('Asia/Seoul').format();

  //console.log(req.params.month, startDt, endDt);

  DnwDetail.findAll({
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
          model: DnwItem,
          required: true,
          attributes: ['name'],
        },
     ],
      where: {
        standard_dt: {
          [Op.between]: [startDt, endDt], 
        }
      }
  })
  .then(details => {
    if (!details) {
      return res.status(404).send({ message: "Not found." });
    }
    res.status(200).send(success(details));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};
