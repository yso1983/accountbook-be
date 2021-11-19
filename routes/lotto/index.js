const db = require('../../db/mariadb');
const query = require('../../db/query/lotto.js');
const express = require('express');
const logger = require('../../winston')
const router = express.Router();
const axios = require('axios');

const lottoUrl = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';

/**************************************************** function ***********************************************/
//중복 체크
const getByData = (drwNo, res) => {
   db.query(query.selectById, [drwNo], (err, rows, fields) => {
    console.log(`-------${ drwNo }------`);
    if(err){
      logger.error(err);
    }
    
    if(rows = null || rows.length == 0){
      callLottoApi(drwNo, res);
    }
    else{
      getByData(drwNo + 1, res);
    }
  });
}

//로또 API연동 
const callLottoApi = (drwNo, response) => {
  let url = lottoUrl + drwNo;

  axios.get(url)
  .then((res)=>{

    let data = res.data;
    //console.log(data);

    if(data && data.returnValue == 'success'){
      let params = [
        data.drwNo, data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6, data.bnusNo, 
        data.totSellamnt, data.firstAccumamnt, data.firstPrzwnerCo, data.firstWinamnt, data.drwNoDate
      ];

      let sortParams = [ data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6].sort((a, b) => a - b);
      sortParams.unshift(data.drwNo);

      db.query(query.insert, params,(err, rows, fields) => {
        if(err){
          logger.error(err);
        }

        db.query(query.insertSort, sortParams,(err2, rows2, fields2) => {
          if(err2){
            logger.error(err2);
          }
          
          getByData(drwNo + 1, res);
        });
      });
    }
    else{
      response.json({result : 'success'});
    }
   
  }).catch((error)=>{
      logger.error(error);
      response.json({result : 'error'});
  })
}

const getRandom = (idx) =>
{   
  //무한루프 방지용
  if(idx > 3)
    return [];

  let printVal = [];
  let sNum = 0;
  let loopCnt = 6;
  for (i = 0; i < loopCnt; i++) {
      sNum = Math.ceil(45 * Math.random());
      if(printVal.indexOf(sNum) > -1){
          loopCnt++;
      }
      else
      {
          printVal.push(sNum);
      }
  }

  printVal = printVal.sort((a, b) => a - b);

  try {
      db.query(query.selectSort, printVal, (err, rst) => {
      if(err){
        logger.error(err);
         return [];
      }

      if(rst == null || rst[0] == null || rst[0].length == 0){
        return printVal;
      }
      else {
        getRandom(idx + 1);
      }
    });

  } catch (error) {
    return [];
  }
  return printVal;
}

const returnRandomData = (res, httpMethod) =>{
  let result = [];
  
  //promise아닌 더 좋은 방법이 없을까...
  new Promise((resolve, reject) => {
    resolve(getRandom(1));
  }).then(r => {
    result.push(r);
    return getRandom(1);
  }).then(r => {
    result.push(r);
    return getRandom(1);
  }).then(r => {
    result.push(r);
    return getRandom(1);
  }).then(r => {
    result.push(r);
    return getRandom(1);
  }).then(r => {
    result.push(r);
    if(httpMethod === 'get'){
      res.render('lotto/random', { code: 1, result: result });
    }
    else{
      res.json(result);
    }
  }).catch(err => {
    logger.error(err);
    
    if(httpMethod === 'get'){
      res.render('lotto/random', { code: 0, result: result });
    }
    else{
      res.json(0);
    }
  });
}

/******************************** Router *******************************************/
/* GET items listing. */
//API로 동기화 처리
router.get('/sync/:id', function(req, res, next) {

  let id = req.params.id;

  getByData(parseInt(id), res);
});

//당첨 내역 리스트
router.get('/', function(req, res, next) {
  //logger.info(req);
  db.query(query.select, function(err, result){
    if(err){
      logger.error(err);
    }
    res.json(result);
  });
});

//랜덤 추출
router.get('/random', function(req, res, next){
  returnRandomData(res, 'get');
});

//랜덤 추출
router.post('/random', function(req, res, next){
  returnRandomData(res, 'post');
});

module.exports = router;
