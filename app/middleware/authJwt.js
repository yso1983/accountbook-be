const jwt = require("jsonwebtoken");
const secretKey = require('@app/config/auth.config').secretKey;
const db = require("@db");
const User = db.user;
const { success, failure } = require("./responseJson");

verifyToken = (req, res, next) => {
  
  try {
    //const authToken = req.headers["x-access-token"];
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const groupId = req.headers.groupid;

    if (!authToken) {
      return res.status(403).send(failure("3101", "No token provided!"));
    }

    jwt.verify(authToken, secretKey, (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
            return res.status(200).send(failure("3100", "expired token"));
        } else if (err.message === 'invalid token') {
            return res.status(200).send(failure("3102", "invalid token"));
        } else {
            return res.status(200).send(failure("3103", "invalid token"));
        }
      }
      
      let group = decoded.groups.filter(x => x.id == groupId);

      if(group && group.length > 0){
        req.groupId = group[0].id;
        req.userId = decoded.id;
        next();
      }
      else{
        return res.status(200).send(failure("3104", "소속된 그룹 없음"));
      }

    });
    
  } catch (err) {
    return res.status(403).send(failure("9999", err.message));
  }
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send(failure("3201", "Require Admin Role!"));
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send(failure("3202", "Require Moderator Role!"));
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send(failure("3203", "Require Moderator or Admin Role!"));
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;