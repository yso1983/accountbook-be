CREATE TABLE user
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL, 
  login_id VARCHAR(50) NOT NULL, 
  password text,
  account_locked   enum('N','Y') NOT NULL DEFAULT 'N', 
  PRIMARY KEY (id)
);

CREATE TABLE account
(
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL, 
  name VARCHAR(50) NOT NULL, 
  amount DECIMAL(18, 2),
  remark VARCHAR(200), 
  PRIMARY KEY (id)
);

CREATE TABLE cate
(
  id INT NOT NULL AUTO_INCREMENT,
  gubun ENUM('revenue', 'expenditure') NOT NULL,
  name VARCHAR(50) NOT NULL,
  remark VARCHAR(200), 
  PRIMARY KEY (id)
);

CREATE TABLE departure
(
  id BIGINT NOT NULL AUTO_INCREMENT,
  account_id INT NOT NULL,
  cate_id INT, 
  name VARCHAR(50) NOT NULL, 
  amount DECIMAL(18, 2),
  remark VARCHAR(200), 
  reg_date DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);