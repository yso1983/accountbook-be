const user = require("./user.controller");
const auth = require("./auth.controller");
const account = require("./accountbook/account.controller");
const dnw = require("./accountbook/dnw.controller");
const automaticDnw = require("./accountbook/automatic.dnw.controller");
const home = require("./accountbook/home.controller");
const note = require("./accountbook/note.controller");

module.exports = {
  user,
  auth,
  account,
  dnw,
  automaticDnw,
  home,
  note,
};