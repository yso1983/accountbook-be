const checkLoginidPW = `select id, name, login_id from user where login_id = ? and password = password(?) `; 
const selectOne = `select name from user where id = ? `; 
const select = `select id, name from user`;

module.exports = {
  checkLoginidPW: checkLoginidPW, 
  selectOne: selectOne,
  select: select
}