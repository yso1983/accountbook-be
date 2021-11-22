const select = `select * from lotto_info `;
const selectById = `select * from lotto_info WHERE drwNo = ? `;
const insert = `insert into lotto_info(drwNo , drwtNo1 , drwtNo2 , drwtNo3 , drwtNo4 
     , drwtNo5, drwtNo6 , bnusNo , totSellamnt , firstAccumamnt , firstPrzwnerCo , firstWinamnt, drwNoDate ) 
     values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) `;
const selectLastDrwNo = `select max(drwNo) as 'drwNo' from lotto_info `;

const insertSort = `insert into lotto_info_sort(drwNo , drwtNo1 , drwtNo2 , drwtNo3 , drwtNo4, drwtNo5, drwtNo6 ) 
     values(?, ?, ?, ?, ?, ?, ? ) `;

const selectSort = ` select 1 from lotto_info_sort WHERE drwtNo1 = ? and drwtNo2 = ? and drwtNo3 = ? and drwtNo4 = ? and drwtNo5 = ? and drwtNo6 = ? `;

module.exports = {
  select: select,
  selectById: selectById,
  insert: insert,
  insertSort: insertSort,
  selectSort: selectSort,
  selectLastDrwNo: selectLastDrwNo,
};