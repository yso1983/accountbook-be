module.exports = function(db) {
  db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
  });
  db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
  });

  db.user.hasMany(db.account, {foreignKey: 'user_id'});
  db.account.belongsTo(db.user, {foreignKey: 'user_id'});

  db.dnwItem.hasMany(db.dnwDetail, {foreignKey: 'dnw_item_id'});
  db.dnwDetail.belongsTo(db.dnwItem, {foreignKey: 'dnw_item_id'});

  db.account.hasMany(db.dnwDetail, {foreignKey: 'account_id'});
  db.dnwDetail.belongsTo(db.account, {foreignKey: 'account_id'});

  db.dnwItem.hasMany(db.automaticDnw, {foreignKey: 'dnw_item_id'});
  db.automaticDnw.belongsTo(db.dnwItem, {foreignKey: 'dnw_item_id'});

  db.account.hasMany(db.automaticDnw, {foreignKey: 'account_id'});
  db.automaticDnw.belongsTo(db.account, {foreignKey: 'account_id'});
  
  db.automaticDnw.hasMany(db.autoDnwExecLog, {foreignKey: 'automatic_id'});
  db.autoDnwExecLog.belongsTo(db.automaticDnw, {foreignKey: 'automatic_id'});
  
  db.group.hasMany(db.account, {foreignKey: 'group_id'});
  db.account.belongsTo(db.group, {foreignKey: 'group_id'});

  db.group.hasMany(db.dnwItem, {foreignKey: 'group_id'});
  db.dnwItem.belongsTo(db.group, {foreignKey: 'group_id'});

  db.user.belongsToMany(db.group, {
    through: "users_groups",
    foreignKey: "groupId",
    otherKey: "userId"
  });
  db.group.belongsToMany(db.user, {
    through: "users_groups",
    foreignKey: "userId",
    otherKey: "groupId"
  });

};