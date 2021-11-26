module.exports = {
  HOST: "localhost",
  USER: "yso1983",
  PASSWORD: "123456",
  DB: "accountbook",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};