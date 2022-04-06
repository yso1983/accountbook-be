const db = require("@db");
const logger = require('@winston');
const { success, failure } = require('@utils').responseJson;
const { upsert } = require('@utils').sequelizeUtil;
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
        
        let execCnt = 0;

        let promises = results.forEach(automatic => {
          //오늘 실행 로그 조회
          db.autoDnwExecLog.findOne({
            where: {
              automatic_id: automatic.id,
              seccess_yn: 'Y',
              standard_dt: date.format('YYYY-MM-DD')
            }
          })
          .then(log => {
            
            logger.info(`[schedule:exec log] - automatic = ${automatic.id} EXIST: ${(log ? true : false)}`);
            //1회 한건씩 실행하자..
            if(!log && execCnt < 1){
              let params = { 
                account_id: automatic.account_id, 
                dnw_item_id: automatic.dnw_item_id, 
                created_user_id: automatic.created_user_id, 
                amount: automatic.amount, 
                standard_dt:  date.format('YYYY-MM-DD'), 
                remark: '매월 자동 입출금'
              };

              setDnwDetail(params, automatic.id);

              execCnt++;
            }
            else{
              logger.info("[schedule:exec log] - SUCCESS: already exist");
            }

          })
          .catch(err => logger.error("[schedule:exec log] - ERROR: " + err.message));

          //await Promise.all(promises);
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

const setDnwDetail = async (params, automatic_id) => {
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

      logger.info("[accountParams]", accountParams);
      
      return account.update(accountParams, { transaction: t })
        .then(result => { 
          params.std_account_amount = account.amount;
          params.latest_account_amount = accountParams.amount;
          logger.info("[dnwParams]", params);
          return db.dnwDetail.create(params, {transaction: t}); 
        })
        .then(result => {
          return db.autoDnwExecLog.create({automatic_id : automatic_id, seccess_yn : 'Y', standard_dt: params.standard_dt}, {transaction: t});
        })
        .then((result) => { 
          t.commit(); //커밋 
          logger.info("[schedule:dnw.detail] - SUCCESS: OK");
          return result;
        }).catch((err) => { 
          logger.error("[schedule:dnw.detail] - ERROR: " + err.message);
          t.rollback(); //롤백 설정 
          db.autoDnwExecLog.create({automatic_id : automatic_id, seccess_yn : 'N', standard_dt: params.standard_dt, error_msg : err.message});
          return err;
        }); 

    })
    .catch(err => {
      logger.error("[schedule:dnw.detail] - ERROR: " + err.message);
      db.autoDnwExecLog.create({automatic_id : automatic_id, seccess_yn : 'N', error_msg : err.message});
    });
  });
}