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

exports.getDnwThisMonth = (req, res) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  let startDt = moment(new Date(year, (month - 1), 1, 0, 0, 0)).tz('Asia/Seoul').format();
  let endDt = moment(new Date(year, (month + 1), 1, 0, 0, 0)).tz('Asia/Seoul').format();

  let limit = req.query.limit;

  DnwDetail.findAll({
    attributes: [
      [sequelize.fn('date_format', sequelize.col('standard_dt'),'%Y-%m'), 'yearMonth'], 
      [sequelize.fn('sum', sequelize.col('dnw_details.amount')), 'total'],
      [sequelize.fn('date_format', sequelize.literal('now()') ,'%Y-%m'), 'thisYearMonth'], 
    ],
    group :[sequelize.fn('date_format', sequelize.col('standard_dt'),'%Y-%m')],
    raw: true,
    include: [
      {
        model: Account,
        where: {group_id: req.groupId},
        required: true
      }
    ],
    where: {
      amount: {
        [Op.lt]: 0
      },
      standard_dt: {
        [Op.between]: [startDt, endDt], 
      },
      to_account_id: {
          [Op.is]: null, // Like: from_detail_id IS NULL
      },
    },
    subQuery:false,
    order: sequelize.literal('yearMonth DESC')
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