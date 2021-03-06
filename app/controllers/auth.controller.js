const db = require("@db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = require('@app/config/auth.config').secretKey;
const options = require('@app/config/auth.config').options;
const { sign, verify, refresh, refreshVerify } = require('@middleware').jwtUtil;
const { upsert } = require('@utils').sequelizeUtil;
const logger = require('@winston');
const { success, failure } = require('@utils').responseJson;

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  // Save User to Database
  if (!req.body.groups || req.body.groups.length < 1){
    return res.status(500).send(failure("9900", 'not found groups'));
  }

  if (!req.body.roles || req.body.roles.length < 1){
    return res.status(500).send(failure("9900", 'not found roles'));
  }

  let params = {
    name: req.body.name,
    account_locked: req.body.account_locked, 
    id: req.body.id ?? 0, 
  }

  if(!req.body.id || parseInt(req.body.id) == 0){
    params.username = req.body.username;
    params.email = req.body.email;
    params.password = bcrypt.hashSync('123456', 8);
  }

  upsert(User, params, { id: req.body.id ?? 0})
    .then(user => {
      user.setGroups(req.body.groups)
      .then(() => {
        if (req.body.roles) {
          user.setRoles(req.body.roles).then(() => {
              res.send( success({ message: "User was registered successfully!" }));
            });
          // Role.findAll({
          //   where: {
          //     name: {
          //       [Op.or]: req.body.roles
          //     }
          //   }
          // }).then(roles => {
          //   console.log(roles);

          //   user.setRoles(roles).then(() => {
          //     res.send( success({ message: "User was registered successfully!" }));
          //   });
          // });

        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send( success({ message: "User was registered successfully!" }));
          });
        }
      });
    })
    .catch(err => {
      res.status(500).send(failure("9999",err.message));
    });
};

exports.signin = (req, res) => {
  if(req.body.login_type && req.body.login_type.length > 0){
    SSOLogin(req, res);
    return;
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if (!user) {
      return res.status(404).send(failure("1002", "User Not found." ));
    }

    if (user.account_locked == "Y") {
      return res.status(404).send(failure("1003", "????????? ???????????????." ));
    }
    
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send(failure("1008", "Invalid Password!"));
    }

    //?????? ????????????.
    let groups = [];
    
    user.getGroups()
    .then(data => {

      for (let i = 0; i < data.length; i++) {
        groups.push({id: data[i].id, name: data[i].name});
      }

      const token = sign(user, groups);
      const refreshToken = refresh();
      
      //??????????????? ???????????? ??????. Insert Or Update
      upsert(db.token, { refreshToken: refreshToken, user_id: user.id }, { user_id: user.id })
        .then(function(result){

          let authorities = [];
          
          user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
              authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
              id: user.id,
              //username: user.username,
              name: user.name,
              email: user.email,
              roles: authorities,
              groups: groups,
              accessToken: token,
              refreshToken: refreshToken,
            });
        });
      })
      .catch(err => res.status(401).send(failure("8001", err.message)));

    });
  })
  .catch(err => {
    res.status(500).send(failure("9999", err.message));
  });
};

exports.refresh = (req, res) => {

  if (req.headers.authorization && req.headers.refresh) {
    // access token??? refresh token??? ?????? ????????? ???????????????.
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;

    // access token ?????? -> expired?????? ???.
    const authResult = verify(authToken);

    // access token ??????????????? user??? ????????? ???????????????.
    const decoded = jwt.decode(authToken);
	
    // ????????? ????????? ????????? ????????? ????????? ??????.
    if (decoded === null) {
      res.status(401).send(failure("3001",'No authorized!'));
    }
	
    /* access token??? decoding ??? ????????? ????????? id??? ????????? refresh token??? ???????????????. */
    const refreshResult = refreshVerify(refreshToken, decoded.id);

    // ???????????? ???????????? access token??? ???????????? ??????????????????.
    if (authResult.code !== "0000" && authResult.message === 'jwt expired') {
      // 1. access token??? ????????????, refresh token??? ?????? ??? ?????? => ?????? ????????????????????????.
      if (refreshResult === false) {
        res.status(401).send(failure("3002",'No authorized!'));
      } else {
        
        // 2. access token??? ????????????, refresh token??? ???????????? ?????? ?????? => ????????? access token??? ??????
        const newAccessToken = sign({id : decoded.id, email: decoded.email}, decoded.groups);

        // ?????? ????????? access token??? ?????? ?????? refresh token ?????? ????????????????????? ???????????????.
        res.status(200).send(success(
          {
            accessToken: newAccessToken,
            refreshToken,
          }));
      }
    } else {
      // 3. access token??? ???????????? ???????????? => refresh ??? ????????? ????????????.
      res.status(400).send(failure("3002", 'Acess token is not expired!'));
    }
  } else { // access token ?????? refresh token??? ????????? ?????? ??????
    res.status(400).send(failure("3003", 'Access token and refresh token are need for refresh!'));
  }
};

exports.check = (req, res) => {
  res.status(200).send(success("token is valid!"));
}

function SSOLogin (req, res){
  db.ssoUser.findOne({
    where: {
      email: req.body.email,
      sso_type: req.body.login_type,
      use_yn: 'Y'
    },
    include: [
      {
        model: User,
        required: true,
      }
    ]
  })
  .then(ssoUser => {

    //console.log(ssoUser);
    if (!ssoUser || !ssoUser.user) {
      return res.status(404).send(failure("1002", "User Not found." ));
    }
    
    let user = ssoUser.user;

    //?????? ????????????.
    let groups = [];
    
    user.getGroups()
    .then(data => {

      for (let i = 0; i < data.length; i++) {
        groups.push({id: data[i].id, name: data[i].name});
      }

      const token = sign(user, groups);
      const refreshToken = refresh();
      
      //??????????????? ???????????? ??????. Insert Or Update
      upsert(db.token, { refreshToken: refreshToken, user_id: user.id }, { user_id: user.id })
        .then(function(result){

          let authorities = [];
          
          user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
              authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
              id: user.id,
              //username: user.username,
              name: user.name,
              email: user.email,
              roles: authorities,
              groups: groups,
              accessToken: token,
              refreshToken: refreshToken,
            });
        });
      })
      .catch(err => res.status(401).send(failure("8001", err.message)));

    });
  })
  .catch(err => {
    res.status(500).send(failure("9999", err.message));
  });
}