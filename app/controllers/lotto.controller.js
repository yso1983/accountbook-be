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

  let randomArray = await getRandomArray(5);

  for (let index = 0; index < cnt; index++) {

    await commFunc.sleep(getRandom(loopCnt, randomArray), 250).then(r => printVal = r);
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

const getRandom = (idx, randomArray) => {   
  //무한루프 방지용
  if(idx > 3)
    return [];

  let printVal = [];
  let sNum = 0;

  do {

    if(randomArray){
      sNum = randomArray[Math.ceil(randomArray.length * Math.random()) - 1];
      //console.log("[exec randomArray] : " + sNum);
    }
    else{
      sNum = Math.ceil(45 * Math.random());
    }
    
    if(printVal.indexOf(sNum) == -1) printVal.push(sNum);

  } while (printVal.length < 6);

  return printVal.sort((a, b) => a - b);
}
const getRandomArray = async (cnt) =>{

  let std_array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
    ,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];

  let rst_array = [];

  let sQuery =  `select * from lotto_info WHERE 1=1 ORDER BY drwNo desc limit ` + cnt;

  let lotto =  await db.sequelize.query(sQuery, { type: QueryTypes.SELECT });

  for (let i = 0; i < cnt; i++) {
    rst_array = rst_array.concat(
      std_array.filter((num) => {
        if(!(lotto[i] 
          && (lotto[i].drwtNo1 == num
            || lotto[i].drwtNo2 == num
            || lotto[i].drwtNo3 == num
            || lotto[i].drwtNo4 == num
            || lotto[i].drwtNo5 == num
            || lotto[i].drwtNo6 == num
            || lotto[i].bnusNo == num
          ))){
          return num;
        }
      })
    );
  }

  return rst_array;
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
