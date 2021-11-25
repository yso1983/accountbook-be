const express = require('express');
const passport = require('passport');
const logger = require('@root/winston')
const { isAuth } = require('@passport/middleware')
const { success, failure } = require('@common/result')

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/signin/', isAuth, function(req, res, next) {
  if (req.user) {
    return res.json(success(req.user));
  }
  return res.json(failure("1001", "사용자 정보 없음."));
});

router.post('/auth/signin/', function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.json(failure("1100", "이미 로그인 정보가 존재합니다."));
  }
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.json(failure("1002", info));
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
       return res.json(success(user));
    });
  })(req, res, next); // 미들웨어 호출
});

router.get('/auth/signout', function(req, res, next){
  req.logout();
  return res.json(success(""));
});

module.exports = router;
