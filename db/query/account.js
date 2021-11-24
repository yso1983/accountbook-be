const select = `select * from account`;
const insert = 'INSERT INTO account(user_id, name, amount, remark)VALUES(?, ?, ?, ?)';
const update = `update account set 
            user_id = ?, 
            name = ?, 
            amount = ?,
            remark = ? 
            where id = ?`;

const selectUsers = `select * from user`;

module.exports = {
  select: select,
  insert: insert,
  update: update,
  selectUsers: selectUsers
};