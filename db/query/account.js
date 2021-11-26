const select = `select a.id, a.name, a.amount, a.remark, a.user_id, u.name as 'user_name'
                from account AS a
                join user as u
                on a.user_id = u.id`;
const insert = 'INSERT INTO account(user_id, name, amount, remark)VALUES(?, ?, ?, ?)';
const update = `update account set 
            user_id = ?, 
            name = ?, 
            amount = ?,
            remark = ? 
            where id = ?`;

module.exports = {
  select: select,
  insert: insert,
  update: update
};