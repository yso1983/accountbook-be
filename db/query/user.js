const checkUser = `select id, name, login_id from user where login_id = ? and password = password(?) `; 
const getUser = `select name from user where id = ? `; 

module.exports = {
  checkUser: checkUser, 
  getUser: getUser
}