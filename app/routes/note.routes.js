const { verifyToken } = require("@middleware").authJwt;
const controller = require("@controllers").note;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  /**
  * @swagger
  *  /api/notes:
  *    get:
  *      tags:
  *      - notes
  *      description: 메모 리스트 조회
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
  *        - name: dt
  *          in: query 
  *          description: 검색일자를 입력하세요.(당월)
  *          schema: 
  *            type: string 
  *          examples: 
  *            Sample: 
  *              value: 20220620  
  *          style: simple
  *        - name: limit
  *          in: query 
  *          description: 검색 건수 
  *          schema: 
  *            type: string 
  *          examples: 
  *            Sample: 
  *              value: 10  
  *          style: simple
  *      responses:
  *       200:
  *        description: 메모 리스트 조회
  *        schema:
  *          $ref: '#/components/schemas/Notes'     
  */
  app.get("/api/notes", [verifyToken], controller.findAll);
  
  app.get("/api/notes/:id/details", [verifyToken], controller.findDetail);

    /**
  * @swagger
  *  /api/notes:
  *    put:
  *      tags:
  *      - notes
  *      description: 메모 작성
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
  *      requestBody:
  *         required: true
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Note'       
  *      responses:
  *       200:
  *        description: 메모 작성
  *        schema:
  *          $ref: '#/components/schemas/NoteRes'     
  */
  app.put("/api/notes", [verifyToken], controller.update);
};