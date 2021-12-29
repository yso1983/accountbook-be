require('module-alias/register')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./config/winston');
const session = require('express-session');
const cors = require("cors");
const schedule = require('node-schedule');
const { swaggerUi, specs } = require('./config/swagger');

require('dotenv').config();

var app = express();

const whitelist = ["http://localhost:8080", "http://yso1983.gq", "http://localhost:3000"];
const corsOptions = {
  // origin: function (origin, callback) {
  //   console.log("corsOptions : " + origin);
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not Allowed Origin!"));
  //   }
  // },
};

app.use(cors(corsOptions));

const db = require("./app/models");

//For production, just insert these rows manually and use sync() without parameters to avoid dropping data:

if(process.env.SCHEDULE_VAR == undefined || process.env.SCHEDULE_VAR == 0) {
  
  if(false && process.env.NODE_ENV !== "production" )
  {
    db.sequelize.sync({force: true}).then(() => {
      console.log('Drop and Resync Db');
      require("./app/config/dev.initial.data").initial();
    });
  }
  else{
    db.sequelize.sync();
  };

  let scheduleTime = '00 30 * * * *';

  if(process.env.NODE_ENV !== "production") scheduleTime = '30 * * * * *';

	// schedule your job here.
  const job = schedule.scheduleJob(scheduleTime, function(){
     require("./app/schedules/dnw.detail").start();
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(express.json());

//parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes')(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// morgan 로그 설정 
const combined = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' 
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발

app.use(morgan(morganFormat, {stream : logger.stream}));

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
