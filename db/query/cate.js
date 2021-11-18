const select = `select * from cate`;
const insert = 'INSERT INTO cate(id, gubun, name, remark)VALUES((select ifnull(max(id), 0) + 1 from cate ALIAS_FOR_SUBQUERY),?,?, ?)';
const update = `update cate set 
            gubun = ?,
            name = ?, 
            remark = ? 
            where id = ?`;

module.exports = {
  select: select,
  insert: insert,
  update: update
};