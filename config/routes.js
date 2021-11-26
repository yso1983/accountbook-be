module.exports = function(app) {
  app.use('/', require('@routes/index'));
  /* 로또 관련*/
  app.use('/lotto', require('@routes/lotto/index'));
  require('@app/routes/auth.routes')(app);
  require('@app/routes/user.routes')(app);
  require('@app/routes/account.routes')(app);
};