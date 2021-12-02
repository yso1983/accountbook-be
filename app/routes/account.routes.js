const { verifyToken } = require("@middleware").authJwt;
const controller = require("@controllers").account;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get(
    "/api/accounts",
    [verifyToken],
    controller.findAll
  );

  app.put(
    "/api/accounts",
    [verifyToken],
    controller.update
  );
};