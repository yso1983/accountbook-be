module.exports = (sequelize, Sequelize) => {
  return sequelize.define("automatic_dnws_exec_log", {
    automatic_id : {
      type: Sequelize.INTEGER,
      references: { model: 'automatic_dnws', key: 'id' },
    },
    seccess_yn : {
      type: Sequelize.ENUM('N', 'Y'),
      defaultValue: 'N',
    },
    standard_dt: {
      type: Sequelize.STRING(10), //yyyy-MM-dd
      allowNull: false
    },
    error_msg :{
      type: Sequelize.STRING(200),
    }
  });
};