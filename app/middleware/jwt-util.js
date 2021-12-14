
const jwt = require("jsonwebtoken");
const secretKey = require('@app/config/auth.config').secretKey;
const options = require('@app/config/auth.config').option;
const db = require("@db");
const Tokens = db.token;

module.exports = {
  sign: (user, groups) => { // access token 발급
    const payload = {
      id: user.id,
      email: user.email,
      groups: groups
    };
    return jwt.sign(payload, secretKey, options);
  },

  verify: (token) => { // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, secretKey);
      return {
        code: "0000",
        id: decoded.id,
        email: decoded.email,
        groups: decode.groups
      };
    } catch (err) {
      return {
        code: "9999",
        message: err.message,
      };
    }
  },

  refresh: () => { 
    return jwt.sign({}, secretKey, { // refresh token은 payload 없이 발급
      algorithm: options.algorithm,
      expiresIn: '14d',
    });
  },
  
  refreshVerify: async (token, userId) => { // refresh token 검증
    try {
      Tokens.findOne({
        where: {
          user_id: userId
        }
      })
      .then(data => {
        if (token === data.refreshToken) {
          try {
            jwt.verify(token, secretKey);
            return true;
          } catch (err) {
            return false;
          }
        } else {
          return false;
        }
      })
      .catch(err => {
        return false;
      });

    } catch (err) {
      return false;
    }
  },
};