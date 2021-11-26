const db = require("@db");
const User = db.user;
const { success, failure } = require('@responseJson');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUsers = (req, res) => {
  User.findAll({
    attributes: ['id', 'name', 'email']
  })
  .then(users => {
    if (!users) {
      return res.status(404).send({ message: "User Not found." });
    }
    res.status(200).send(success(users));
  })
  .catch(err => {
    res.status(500).send(err.message);
  });
};