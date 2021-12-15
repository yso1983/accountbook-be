const { verifyToken } = require("@middleware").authJwt;
const controller = require("@controllers").home;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get( "/api/home/dnw/month", [verifyToken], controller.getDnwThisMonth);

};