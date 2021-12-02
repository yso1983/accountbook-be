module.exports = (sequelize, Sequelize) => {
  return sequelize.define("dnw_details", {
    account_id : {
      type: Sequelize.INTEGER,
      references: { model: 'account', key: 'id' }
    },
    dnw_item_id : {
      type: Sequelize.INTEGER,
      references: { model: 'dnw_items', key: 'id' }
    },
    amount : {
      type: Sequelize.DECIMAL(18,2),
      allowNull: false,
    },
    standard_dt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    remark: {
      type: Sequelize.STRING(200),
    },
  });
};