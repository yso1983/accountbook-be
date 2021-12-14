module.exports = (sequelize, Sequelize) => {
  return sequelize.define("accounts", {
    user_id : {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    name : {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    amount : {
      type: Sequelize.DECIMAL(18,2),
      allowNull: false,
    },
    remark: {
      type: Sequelize.STRING(200),
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' }
    }
  });
};