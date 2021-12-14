module.exports = (sequelize, Sequelize) => {
  return sequelize.define("groups", {
    name : {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    remark: {
      type: Sequelize.STRING(200),
    },
    use_yn: {
      type: Sequelize.ENUM('N', 'Y'),
      defaultValue: 'Y'
    },
  });
};