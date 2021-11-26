module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING(50),
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT
    },
    account_locked: {
      type: Sequelize.ENUM('N', 'Y'),
      defaultValue: 'N'
    },
  });

  return User;
};