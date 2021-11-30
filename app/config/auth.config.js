module.exports = {
  secretKey: process.env.JWT_SECRETKEY, // 원하는 시크릿 키
  option : {
    algorithm : process.env.JWT_OPTION_ALGORITHM, // 해싱 알고리즘
    expiresIn : process.env.JWT_OPTION_EXPIRESIN,  // 토큰 유효 기간
    issuer : process.env.JWT_OPTION_ISSUER // 발행자
  }
};