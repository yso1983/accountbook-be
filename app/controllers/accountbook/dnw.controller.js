const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@middleware').responseJson;
const { upsert } = require('@middleware').sequelizeUtil;
const moment = require('moment-timezone');
const commFunc =  require('@middleware').commFunc;

const DnwDetail = db.dnwDetail;
const DnwItem = db.dnwItem;
const Account = db.account;
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
    amount: commFunc.parseFloat(req.body.amount), 
    standard_dt: req.body.standard_dt, 
    remark: req.body.remark,
  };

  const to_account_id = req.body.to_account_id;
  if(to_account_id && commFunc.parseFloat(to_account_id) > 0){
    createDetailFromAndTo(params, to_account_id, res) ;
  }
  else{
    createOnlyDetail(params, res);
  }

};

function createOnlyDetail(params, res) {
  Account.findOne({
    where: {
      id: params.account_id
    }
  })
  .then(account => {

    let accountParams = {
      id : account.id,
      amount : (parseFloat(account.amount) + parseFloat(params.amount)),
      user_id : account.user_id,
      name : account.name,
      remark : account.remark
    };

    db.sequelize.transaction()
    .then(t => { 
      console.log(accountParams);
      
      return account.update(accountParams, { transaction: t })
        .then(result => { 
          console.log(params);

          return DnwDetail.create(params, {transaction: t}); 
        })
        .then(result => {


        })
        .then((result) => { 

          t.commit(); //커밋 

          return res.status(200).send(success(result));
        }).catch((err) => { 
          console.log(err.message);
          t.rollback(); //롤백 설정 
          return res.status(401).send(failure("9998", err.message));
        }); 

    })
    .catch(err => res.status(401).send(failure("9999", err.message)));
  });
}


function createDetailFromAndTo(params, to_account_id, res) {


  Account.findOne({
    where: {
      id: params.account_id
    }
  })
  .then(account => {

    let accountParams = {
      id : account.id,
      amount : (parseFloat(account.amount) + parseFloat(params.amount)),
      user_id : account.user_id,
      name : account.name,
      remark : account.remark
    };

    Account.findOne({
      where: {
        id: to_account_id
      }
    })
    .then(toAccount => {

      let toAccountParams = {
        id : toAccount.id,
        amount : (parseFloat(toAccount.amount) - parseFloat(params.amount)),
        user_id : toAccount.user_id,
        name : toAccount.name,
        remark : toAccount.remark
      };

      db.sequelize.transaction()
      .then(t => { 
        console.log(accountParams);
        
        return account.update(accountParams, { transaction: t })
          .then(result => { 
            console.log(params);

            return DnwDetail.create(params, {transaction: t}); 
          })
          .then(result => {
            
            return toAccount.update(toAccountParams, { transaction: t });
          })
          .then(result => { 
            params.account_id = to_account_id;
            params.amount = 0 - params.amount;

            return DnwDetail.create(params, {transaction: t}); 
          })
          .then((result) => { 

            t.commit(); //커밋 

            return res.status(200).send(success(result));
          }).catch((err) => { 
            console.log(err.message);
            t.rollback(); //롤백 설정 
            return res.status(401).send(failure("9998", err.message));
          }); 

      })
      .catch(err => res.status(401).send(failure("9997", err.message)));

    })
    .catch(err => res.status(401).send(failure("9999", err.message)));
  });
}

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
