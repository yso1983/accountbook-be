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
      checkDuplicateUsernameOrEmail, checkRolesExisted, verifyToken, isAdmin
    ],
    controller.signup
  );

  app.post("/api/auth/", [verifyToken], controller.check);

  /**
  * @swagger
  *   /api/auth/signin:
  *     post:
  *       tags:
  *       - token
  *       description: 로그인
  *       summary: Get Access Token
  *       requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Login'           
  *       produces:
  *       - application/json
  *       responses:
  *         200:
  *           description: 토큰 조회
  */
  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refresh", controller.refresh);
};