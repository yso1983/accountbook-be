const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@middleware').responseJson;
const { upsert } = require('@middleware').sequelizeUtil;
const moment = require('moment-timezone');

const Automatic = db.automaticDnw;
const Op = db.Sequelize.Op;

exports.start = async () => {
  const date = moment(new Date()).tz('Asia/Seoul');
  const dow = date.date();
  
  logger.info("[schedule:dnw.detail] - START");
  logger.info("[schedule:dnw.detail] - TIME: " + date.format('YYYY-MM-DD'));
  try {
    Automatic.findAll({
      where: {day: dow}
    })
    .then(results => {
      logger.info("[schedule:dnw.detail] - EXEC CNT: " + results?.length);
      if (results) {
        
        results.forEach(automatic => {

          db.dnwDetail.findOne({
            where: {
              account_id: automatic.account_id,
              dnw_item_id: automatic.dnw_item_id,
              standard_dt: date.format('YYYY-MM-DD')
            }
          })
          .then(detail => {
            
            logger.info(`[schedule:dnw.detail] - ${detail.id} EXIST: ${(detail ? true : false)}`);

            if(!detail){
              let params = { 
                account_id: automatic.account_id, 
                dnw_item_id: automatic.dnw_item_id, 
                created_user_id: automatic.created_user_id, 
                amount: automatic.amount, 
                standard_dt:  date.format('YYYY-MM-DD'), 
                remark: 'schedule' 
              };

              setDnwDetail(params)
              .then(success =>logger.info("[schedule:dnw.detail] - SUCCESS: " + success))
              .catch(err => logger.error("[schedule:dnw.detail] - ERROR: " + err.message));
            }
            else{
              logger.info("[schedule:dnw.detail] - SUCCESS: already exist");
            }

          })
          .catch(err => logger.error("[schedule:dnw.detail] - ERROR: " + err.message));

        });

      }else{
        logger.info("[schedule:dnw.detail] - NO DATA");
      }
    })
    .catch(err => logger.error("[schedule:dnw.detail] - ERROR: " + err.message));
    
    logger.info("[schedule:dnw.detail] - END");

    
  } catch (error) {
    logger.info("[schedule:dnw.detail] - ERROR:" + error.message);

  }
}

setDnwDetail = (params) => {
  //return new Promise(
  db.account.findOne({
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

      logger.info(accountParams);
      
      return account.update(accountParams, { transaction: t })
        .then(result => { 
          console.log(params);

          return db.dnwDetail.create(params, {transaction: t}); 
        })
        .then((result) => { 
          return t.commit(); //커밋 
        }).catch((err) => { 
          logger.err(err.message);
          return t.rollback(); //롤백 설정 
        }); 

    })
    .catch(err => logger.err(err.message));
  });
}