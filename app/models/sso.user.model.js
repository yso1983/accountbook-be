module.exports = (sequelize, Sequelize) => {
  return sequelize.define("sso_users", {
    user_id : {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    nick_name : {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    sso_type : {
      type: Sequelize.CHAR(10),
      allowNull: false,
    },
    use_yn : {
      type: Sequelize.ENUM('N', 'Y'),
      defaultValue: 'Y',
    },
  });
};