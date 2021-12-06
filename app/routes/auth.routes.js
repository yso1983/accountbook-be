const { checkDuplicateUsernameOrEmail, checkRolesExisted } = require("@middleware").verifySignUp;
const controller = require("@controllers").auth;
const { verifyToken } = require("@middleware").authJwt;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      checkDuplicateUsernameOrEmail,
      checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/", [verifyToken], controller.check);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refresh", controller.refresh);
};