const { verifyToken } = require("@middleware").authJwt;
const controller = require("@controllers").mail;

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
  *  /api/mail/note/send:
  *    post:
  *      tags:
  *      - notes
  *      description: 메모 내용 메일 발송
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
  *               $ref: '#/components/schemas/SendNoteEmail'       
  *      responses:
  *       200:
  *        description: 응답 코드
  */
  app.post( "/api/mail/note/send", [verifyToken], controller.sendNoteMail);

};