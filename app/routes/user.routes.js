const { verifyToken, isModerator, isAdmin} = require("@middleware").authJwt;
const controller = require("@controllers").user;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get("/api/test/all", controller.allAccess);

  // app.get(
  //   "/api/test/user",
  //   [authJwt.verifyToken],
  //   controller.userBoard
  // );

  // app.get(
  //   "/api/test/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  // app.get(
  //   "/api/test/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // );
  
  
  /**
  * @swagger
  *  /api/users:
  *    get:
  *      tags:
  *      - users
  *      description: 사용자 조회
  *      produces:
  *      - application/json
  *      parameters: 
  *        - name: groupid 
  *          in: header 
  *          description: 헤더에 그룹아이디를 입력하세요.
  *          required: true 
  *          schema: 
  *            type: string 
  *          examples: 
  *            Sample: 
  *              value: 1  
  *              summary: group id
  *          style: simple
  *      responses:
  *       200:
  *        description: 사용자 리스트 조회
  *        schema:
  *          $ref: '#/components/schemas/User'     
  */
  app.get(
    "/api/users",
    [verifyToken],
    controller.getUsers
  );

  app.get("/api/groups", [verifyToken, isAdmin], controller.getGroups);
  app.get("/api/group/users", [verifyToken, isAdmin], controller.getUsersByGroupId);
};