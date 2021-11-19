--// 항목
CREATE TABLE cate
(
  id BIGINT NOT NULL AUTO_INCREMENT,
  gubun ENUM('revenue', 'expenditure') NOT NULL,
  name VARCHAR(50) NOT NULL,
  remark VARCHAR(200), 
  PRIMARY KEY (id)
);

CREATE TABLE lotto_info (
  drwNo int, 
  drwtNo1 tinyint, 
  drwtNo2 tinyint, 
  drwtNo3 tinyint, 
  drwtNo4 tinyint, 
  drwtNo5 tinyint, 
  drwtNo6 tinyint, 
  bnusNo tinyint,  
  totSellamnt bigint, 
  firstAccumamnt bigint, 
  firstPrzwnerCo int, 
  firstWinamnt bigint, 
  drwNoDate date 
)

CREATE TABLE lotto_info_sort (
  drwNo int, 
  drwtNo1 tinyint, 
  drwtNo2 tinyint, 
  drwtNo3 tinyint, 
  drwtNo4 tinyint, 
  drwtNo5 tinyint, 
  drwtNo6 tinyint
)
