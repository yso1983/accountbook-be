module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("tokens", {
    user_id : {
      type: Sequelize.INTEGER,
      //references: { model: 'users', key: 'id' }
    },
    refreshToken: {
      type: Sequelize.TEXT
    }
  });

  return User;
};