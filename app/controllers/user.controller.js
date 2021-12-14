const db = require("@db");
const User = db.user;
const { success, failure } = require('@middleware').responseJson;

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
  db.group.findByPk(req.groupId)
  .then(group =>{

    group.getUsers({
      attributes: ['id', 'name', 'email']
    })
    .then(users => {
      if (!users) {
        return res.status(200).send(failure("1001", "User Not found."));
      }
      res.status(200).send(success(users));
    })
    .catch(err => {
      res.status(500).send(failure("9101", err.message));
    });

  })
  .catch(err => {
    res.status(500).send(failure("9102", err.message));
  });
};