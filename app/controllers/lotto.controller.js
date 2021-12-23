const db = require("@db");
const { success, failure } = require('@utils').responseJson;
const { QueryTypes } = require('sequelize');
const query = require('@query/lotto.js');
const commFunc =  require('@utils').commFunc;
const axios = require('axios');
const lottoApiUrl = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';

/* 전체 조회 */
exports.findAll = (req, res) => {
  (async () => {
    return await db.sequelize.query(query.select, { type: QueryTypes.SELECT });
  })()
  .then(r => {
    res.status(200).json(success(r));
  })
  .catch(r => {
    res.status(200).json(failure('9999', r.message));
  });
};

/* 랜덤 추출*/
exports.getRandomData = (cnt, res, httpMethod) => {
  let result = [];
  
  execute(cnt, result)
  .then(r => {
    res.status(200).json(success(r));
  }).catch(r => {
    res.status(200).json(failure('9999', r.message));
  });
}

async function execute(cnt, result){

 let printVal = [];
 let loopCnt = 1;
 cnt =  cnt ?? 5;

  for (let index = 0; index < cnt; index++) {

    await commFunc.sleep(getRandom(loopCnt), 200).then(r => printVal = r);
    //중복 데이터 나오면 한번 더 실행(3회까지만)
    const results = await db.sequelize.query(
      query.selectSort,
      {
        replacements: printVal,
        type: QueryTypes.SELECT
      }
    );

    if(results && results.length > 0){
      loopCnt++;
      cnt++;
    }else{
      result.push(printVal);
      loopCnt = 1;
    }
  }

  return result;
}

const getRandom = (idx) => {   
  //무한루프 방지용
  if(idx > 3)
    return [];

  let printVal = [];
  let sNum = 0;

  do {
     sNum = Math.ceil(45 * Math.random());
     if(printVal.indexOf(sNum) == -1) printVal.push(sNum);

  } while (printVal.length < 6);

  return printVal.sort((a, b) => a - b);
}

/* 최신 정보 업데이트 */
exports.syncLottoInfo = (req, res, next) => {
  (async () => {
    //마지막 동기화 번호 조회
    const lastDrwInfo = await db.sequelize.query(query.selectLastDrwNo, { type: QueryTypes.SELECT });
    let lastDrwNo = 1;
    //console.log(lastDrwInfo);
    if(lastDrwInfo && lastDrwInfo.length > 0) lastDrwNo = parseInt(lastDrwInfo[0].drwNo);

    const sQuery =  `select * from lotto_info WHERE drwNo = :drwNo `;

    let lotto = null;
    let isLoop = true;
    let apiResponse = null;
    let data = null;
    let params = [];
    let sortParams = [];

    while (isLoop) {
      //중복 체크
      lotto =  await db.sequelize.query(sQuery, { replacements: { drwNo: lastDrwNo },type: QueryTypes.SELECT });
      if(!(lotto && lotto.length > 0)){
        //API 연동 
        apiResponse = await axios.get(lottoApiUrl + lastDrwNo);

        data = apiResponse.data;

        if(data && data.returnValue == 'success'){
          params = [
            data.drwNo, data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6, data.bnusNo, 
            data.totSellamnt, data.firstAccumamnt, data.firstPrzwnerCo, data.firstWinamnt, data.drwNoDate
          ];

          sortParams = [ data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6].sort((a, b) => a - b);
          sortParams.unshift(data.drwNo);

          await db.sequelize.query(query.insert, { replacements: params, type: QueryTypes.INSERT });
          await db.sequelize.query(query.insertSort, { replacements: sortParams, type: QueryTypes.INSERT });
        }
        else{
          isLoop = false;
        }
      }
      lastDrwNo++;
    }

  })()
  .then(r => {
    res.status(200).json(success(""));
  })
  .catch(r => {
    res.status(200).json(failure('9999', r.message));
  });
}
