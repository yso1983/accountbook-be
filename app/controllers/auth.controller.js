const db = require("@db");
const randToken = require('rand-token');
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const secretKey = require('../config/auth.config').secretKey;
const options = require('../config/auth.config').options;

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const payload = {
        idx: user.id,
        email: user.email,
      };

      const tokenResult = {
        //sign메소드를 통해 access token 발급!
        token: jwt.sign(payload, secretKey, options),
        refreshToken: randToken.uid(256)
      };

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          //id: user.id,
          name: user.name,
          //username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: tokenResult.token,
          refreshToken: tokenResult.refreshToken
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};