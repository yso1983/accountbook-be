module.exports = {
  HOST: process.env.DB_CONN_HOST,
  USER: process.env.DB_CONN_USER,
  PASSWORD: process.env.DB_CONN_PASSWORD,
  DB: process.env.DB_CONN_DATABASE,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};