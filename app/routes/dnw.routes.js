const { verifyToken } = require("@middleware").authJwt;
const controller = require("@controllers").dnw;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get( "/api/dnw/items", [verifyToken], controller.findAllItem);
  app.put( "/api/dnw/items", [verifyToken], controller.createItem);
  
  app.get( "/api/dnw/details", [verifyToken], controller.findAllDetails);
  app.put( "/api/dnw/details", [verifyToken], controller.createDetail);

};