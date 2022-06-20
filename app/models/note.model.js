module.exports = (sequelize, Sequelize) => {
  return sequelize.define("notes", {
    remark: {
      type: Sequelize.TEXT,
    },
    use_yn: {
      type: Sequelize.ENUM('N', 'Y'),
      defaultValue: 'Y'
    },
    created_user_id : {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    created_dt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' }
    }
  });
};