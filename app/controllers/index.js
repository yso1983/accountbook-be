const user = require("./user.controller");
const auth = require("./auth.controller");
const account = require("./accountbook/account.controller");
//const dnw = require("./accountbook/dnw.controller");

module.exports = {
  user,
  auth,
  account,
//  dnw,
};