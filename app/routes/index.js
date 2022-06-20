module.exports = function(app) {
  app.use('/', require('@root/routes/index'));
  /* 로또 관련*/
  app.use('/lotto', require('@root/routes/lotto/index'));

  require('./auth.routes')(app);
  require('./user.routes')(app);
  require('./account.routes')(app);
  require('./dnw.routes')(app);
  require('./automatic.dnw.routes')(app);
  require('./home.routes')(app);
  require('./note.routes')(app);
};