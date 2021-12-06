const { verifyToken } = require("@middleware").authJwt;
const controller = require("@controllers").automaticDnw;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get( "/api/automatic/list", [verifyToken], controller.findAll);
  app.put( "/api/automatic", [verifyToken], controller.create);
  app.post( "/api/automatic/:id/remove", [verifyToken], controller.delete);

};