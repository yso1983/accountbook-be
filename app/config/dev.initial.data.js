const db = require("@app/models");
var bcrypt = require("bcryptjs");

const Role = db.role;
const User = db.user;

exports.initial = () => {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });

  User.create({
    name: "용수",
    username : "yso",
    email : "yso1983@gmail.com",
    password : bcrypt.hashSync("123456", 8),
    roles: ["moderator", "user", "admin"]
  });
  
  User.create({
    name: "봉화",
    username : "bhl",
    email : "libonghua@gmail.com",
    password : bcrypt.hashSync("123456", 8),
    roles: ["admin"]
  });
}