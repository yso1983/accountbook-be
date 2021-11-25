const LocalStrategy = require('passport-local').Strategy;
const db = require('@mariadb');
const query= require('@query/user');
const express = require('express');
const logger = require('@root/winston')

exports.config = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    db.query(query.getUser, [id], (err,rows,fields) => {
      if(!err && rows && rows.length > 0){
        const result =  JSON.parse(JSON.stringify(rows))
        done(null, result[0]);
      }
    });
  });
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
  }, (id, password, done) => {
    db.query(query.checkUser, [id, password], (err,rows,fields) => {

      if(err){
        logger.err(err);
        done(null, false, {
          message: err
        });
      }
      else if(rows && rows.length > 0){
        const result =  JSON.parse(JSON.stringify(rows))
        done(null, result[0]);
      }
      else{
        done(null, false, {
          user: null
        });
      }
    });
  }));
};