const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@utils').responseJson;
const { upsert } = require('@utils').sequelizeUtil;
const moment = require('moment-timezone');
const commFunc =  require('@utils').commFunc;

const DnwDetail = db.dnwDetail;
const DnwItem = db.dnwItem;
const Account = db.account;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

// Create and Save a new Tutorial
exports.createItem = (req, res) => {

  upsert(DnwItem, { name: req.body.name, remark: req.body.remark, group_id: req.groupId  }, { id: req.body.id })
    .then(result => {
       res.status(200).send(success(result));
    })
    .catch(err => res.status(401).send(failure("9999", err.message)));
};

// Retrieve all Tutorials from the database.
exports.findAllItem = (req, res) => {
  DnwItem.findAll({
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('dnw_details.id')), 'count']
      ]
    },
    include: [{
      attributes: [],
      model:DnwDetail,
      duplicating: false,
      required: false
    }],
    where: { group_id: req.groupId },
    group: ['dnw_items.id'],
    order: [[sequelize.literal('count'), 'DESC'], ['id', 'DESC']]
  })
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
  const limit = commFunc.parseFloat(req.query.limit ?? 5);
  const page = commFunc.parseFloat(req.query.page ?? 1);

  DnwDetail.findAll({
    include: [
      {
        model: Account,
        where: { group_id: req.groupId },
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
    order: [
      ['id', 'DESC']
    ],
    offset: ((page-1) * limit),
    limit : limit,
    subQuery:false,
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
    created_user_id: req.userId,
    amount: commFunc.parseFloat(req.body.amount), 
    standard_dt: req.body.standard_dt, 
    remark: req.body.remark,
  };

  const to_account_id = req.body.to_account_id;
  if(to_account_id && commFunc.parseFloat(to_account_id) > 0){
    if(params.account_id == to_account_id){
      return res.status(401).send(failure("9991", "???????????? ????????? ???????????? ????????? ???????????????."));
    }

    createDetailFromAndTo(params, to_account_id, req, res) ;
  }
  else{
    createOnlyDetail(params, req, res);
  }

};

function createOnlyDetail(params, req, res) {
  Account.findOne({
    where: {
      id: params.account_id,
      group_id: req.groupId
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
      logger.info(accountParams);
      
      return account.update(accountParams, { transaction: t })
        .then(result => { 
          params.std_account_amount = account.amount;
          params.latest_account_amount = accountParams.amount;
          logger.info(params);

          return DnwDetail.create(params, {transaction: t}); 
        })
        .then((result) => { 

          t.commit(); //?????? 

          return res.status(200).send(success(result));
        }).catch((err) => { 
          logger.error(err.message);
          t.rollback(); //?????? ?????? 
          return res.status(401).send(failure("9998", err.message));
        }); 

    })
    .catch(err => {
      logger.error(err.message);
      res.status(401).send(failure("9999", err.message));
    });
  });
}


function createDetailFromAndTo(params, to_account_id, req, res) {

  Account.findOne({
    where: {
      id: params.account_id,
      group_id: req.groupId
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
        id: to_account_id,
        group_id: req.groupId
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
        return account.update(accountParams, { transaction: t })
          .then(result => { 
            params.to_account_id = to_account_id;
            params.std_account_amount = account.amount;
            params.latest_account_amount = accountParams.amount;
            return DnwDetail.create(params, {transaction: t}); 
          })
          .then(result => {
            params.from_detail_id = result.id;
            return toAccount.update(toAccountParams, { transaction: t });
          })
          .then(result => { 
            
            params.account_id = to_account_id;
            params.to_account_id = null;
            params.amount = 0 - params.amount;
            params.std_account_amount = toAccount.amount;
            params.latest_account_amount = toAccountParams.amount;

            return DnwDetail.create(params, {transaction: t}); 
          })
          .then((result) => { 

            t.commit(); //?????? 

            return res.status(200).send(success(result));
          }).catch((err) => { 
            logger.error(err.message);
            t.rollback(); //?????? ?????? 
            return res.status(401).send(failure("9998", err.message));
          }); 

      })
      .catch(err => {
        logger.error(err.message);
        return res.status(401).send(failure("9997", err.message));
      
      });

    })
    .catch(err =>{
      logger.error(err.message);
      return res.status(401).send(failure("9999", err.message));
    });
  });
}

exports.findDetailsByMonth = (req, res) => {
  let startDt = moment(new Date(req.params.month.replace('-', '').substring(0, 4), (parseInt(req.params.month.replace('-', '').substring(4)) - 1), 1, 0, 0, 0))
    .tz('Asia/Seoul').format();
  let endDt = moment(new Date(req.params.month.replace('-', '').substring(0, 4), req.params.month.replace('-', '').substring(4), 1, 0, 0, 0))
    .tz('Asia/Seoul').format();

  //logger.info(req.params.month, startDt, endDt);

  DnwDetail.findAll({
     include: [
        {
          model: Account,
          where: {group_id: req.groupId},
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
      },
      order: [
        ['id', 'DESC']
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

exports.getDnwChartLastFewDays = (req, res) => {
  const day = commFunc.parseFloat(req.params.lastday ?? 30);
  let startDt = moment(commFunc.addDays(new Date(), (0 - day))).tz('Asia/Seoul').format();
  let endDt = moment(new Date()).tz('Asia/Seoul').format();

  let limit = req.query.limit;

  DnwDetail.findAll({
    attributes: [
      [sequelize.fn('date_format', sequelize.col('standard_dt'),'%Y-%m-%d'), 'day'], 
      [sequelize.literal(`SUM(CASE WHEN dnw_details.amount >= 0  THEN dnw_details.amount ELSE 0 END)`), 'plus'],
      [sequelize.literal(`SUM(CASE WHEN dnw_details.amount < 0  THEN dnw_details.amount ELSE 0 END)`), 'minus'],
      //[sequelize.fn('sum', sequelize.col('amount')), 'total']
      "dnw_details.remark",
    ],
    group :[sequelize.fn('date_format', sequelize.col('standard_dt'),'%Y-%m-%d')],
    raw: true,
    include: [
      {
        model: Account,
        where: {group_id: req.groupId},
        required: true,
        attributes: ['name']
      }
    ],
    where: {
      // amount: {
      //   [Op.lt]: 0
      // },
      standard_dt: {
        [Op.between]: [startDt, endDt], 
      }
    },
    //offset: 0, //((page-1)*limit),
    //limit : commFunc.parseFloat(limit ?? 5),
    subQuery:false,
    order: sequelize.literal('day DESC')
  })
  .then(details => {

    if (!details) {
      return res.status(404).send(failure("4101", "Not found."));
    }
    res.status(200).send(success(details));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });

};

exports.findDnwTotalAmountbyMonthAndAccountId = (req, res) => {
  let year;
  let { month } = req.params;

  if(month !== "last" && month && month >= 6){
    year = month.replace('-', '').substring(0, 4);
    month = parseInt(month.replace('-', '').substring(4));
  }
  else {
    year = new Date().getFullYear();
    month = new Date().getMonth() + 1;
  }
  
  let startDt = moment(new Date(year, (month - 1), 1, 0, 0, 0)).tz('Asia/Seoul').format();
  let endDt = moment(new Date(year, month, 1, 0, 0, 0)).tz('Asia/Seoul').format();
  

  DnwDetail.findOne({
    where: {
      account_id: req.query.accountId,
      standard_dt: {
        [Op.between]: [startDt, endDt], 
      },
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('amount')), 'total'], 
    ],
    subQuery:false,
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