module.exports = (sequelize, Sequelize) => {
  return sequelize.define("dnw_items", {
    name : {
      type: Sequelize.STRING(50),
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