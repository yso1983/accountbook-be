const db = require("@db");
const User = db.user;
const { success, failure } = require('@utils').responseJson;

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

exports.getGroups = (req, res) => {
  db.group.findAll()
  .then(groups =>{
    if (!groups) {
      return res.status(200).send(failure("1001", "User Not found."));
    }
    res.status(200).send(success(groups));
  })
  .catch(err => {
    res.status(500).send(failure("9102", err.message));
  });
};

exports.getUsersByGroupId = (req, res) => {
  db.user.findAll(fn_findAllCondition(req))
  .then(users =>{

    if (!users) {
      return res.status(200).send(failure("1001", "User Not found."));
    }
    res.status(200).send(success(users));

  })
  .catch(err => {
    res.status(500).send(failure("9102", err.message));
  });
};

function fn_findAllCondition(req){
  if(req.query.groupId){
    return {
     include: [
        {
          model: db.ssoUser,
          attributes: ['id', 'email', 'nick_name', 'sso_type', 'use_yn'],
        },
        {
          model: db.group,
          require: true,
          attributes: ['id', 'name'],
          where: {
            id: req.query.groupId
          }
        },
        {
          model: db.role,
          require: true,
          attributes: ['id', 'name']
        }
      ],
      attributes: ['id', 'name', 'username', 'email', 'account_locked']
     };
  }else{
    return {
     include: [
        {
          model: db.ssoUser,
          attributes: ['id', 'email', 'nick_name', 'sso_type', 'use_yn'],
        },
        {
          model: db.group,
          require: true,
          attributes: ['id', 'name']
        },
        {
          model: db.role,
          require: true,
          attributes: ['id', 'name']
        }
      ],
      attributes: ['id', 'name', 'username', 'email', 'account_locked'],
    };
  }
}