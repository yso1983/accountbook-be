module.exports = (sequelize, Sequelize) => {
  return sequelize.define("automatic_dnws", {
    account_id : {
      type: Sequelize.INTEGER,
      references: { model: 'accounts', key: 'id' },
    },
    dnw_item_id : {
      type: Sequelize.INTEGER,
      references: { model: 'dnw_items', key: 'id' }
    },
    created_user_id : {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    amount : {
      type: Sequelize.DECIMAL(18,2),
      allowNull: false,
    },
    day: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
};