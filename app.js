require('module-alias/register')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./config/winston');
const session = require('express-session');
var passport = require('passport');

require('./config/passport').config(passport);
require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
//로그인 쿠키 관련
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure:false,
  }
}));
// Passport // 2
app.use(passport.initialize()); // req에 passport의 설정값들 적용
app.use(passport.session()); // session 정보 저장 (req.session, req.user)
// Custom Middlewares // 3
// app.use(function(req,res,next){
//   res.locals.isAuthenticated = req.isAuthenticated();
//   res.locals.currentUser = req.user;
//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./config/route'));

// morgan 로그 설정 
const combined = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' 
//const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발

app.use(morgan('dev', {stream : logger.stream}));
//app.use(morgan(morganFormat, {stream : logger.stream})); 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
