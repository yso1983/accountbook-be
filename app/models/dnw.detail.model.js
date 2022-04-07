module.exports = (sequelize, Sequelize) => {
  return sequelize.define("dnw_details", {
    account_id : {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'accounts', key: 'id' },
    },
    dnw_item_id : {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    standard_dt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    remark: {
      type: Sequelize.STRING(200),
    },
    from_detail_id : {
      type: Sequelize.INTEGER
    },
    to_account_id : {
      type: Sequelize.INTEGER
    },
    std_account_amount : {
      type: Sequelize.DECIMAL(18,2),
    },
    latest_account_amount : {
      type: Sequelize.DECIMAL(18,2),
    },
  });
};