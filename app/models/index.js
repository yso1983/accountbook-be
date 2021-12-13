const config = require("@app/config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("@app/models/user.model.js")(sequelize, Sequelize);
db.role = require("@app/models/role.model.js")(sequelize, Sequelize);
db.account = require("@app/models/account.model.js")(sequelize, Sequelize);
db.token = require("@app/models/token.model.js")(sequelize, Sequelize);
db.dnwItem = require("@app/models/dnw.item.model")(sequelize, Sequelize);
db.dnwDetail = require("@app/models/dnw.detail.model")(sequelize, Sequelize);
db.automaticDnw = require("@app/models/automatic.dnw.model")(sequelize, Sequelize);
db.autoDnwExecLog = require("@app/models/automatic.dnw.history")(sequelize, Sequelize);

db.ROLES = ["user", "admin", "moderator"];

require('./mapping')(db);

module.exports = db;