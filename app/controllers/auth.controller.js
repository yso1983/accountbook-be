const db = require("@db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = require('@app/config/auth.config').secretKey;
const options = require('@app/config/auth.config').options;
const { sign, verify, refresh, refreshVerify } = require('@middleware').jwtUtil;
const { upsert } = require('@middleware').sequelizeUtil;
const logger = require('@winston');
const { success, failure } = require('@middleware').responseJson;

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
            res.send( success({ message: "User was registered successfully!" }));
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send(success({ message: "User was registered successfully!" }));
        });
      }
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
    
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send(failure("1008", "Invalid Password!"));
    }

    //그룹 체크하자.
    let groups = [];
    
    user.getGroups()
    .then(data => {

      for (let i = 0; i < data.length; i++) {
        groups.push({id: data[i].id, name: data[i].name});
      }

      const token = sign(user, groups);
      const refreshToken = refresh();
      
      //토큰있으면 업데이트 한다. Insert Or Update
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
    // access token과 refresh token의 존재 유무를 체크합니다.
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);

    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);
	
    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(401).send(failure("3001",'No authorized!'));
    }
	
    /* access token의 decoding 된 값에서 유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = refreshVerify(refreshToken, decoded.id);

    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.code !== "0000" && authResult.message === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult === false) {
        res.status(401).send(failure("3002",'No authorized!'));
      } else {
        
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign({id : decoded.id, email: decoded.email}, decoded.groups);

        // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
        res.status(200).send(success(
          {
            accessToken: newAccessToken,
            refreshToken,
          }));
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      res.status(400).send(failure("3002", 'Acess token is not expired!'));
    }
  } else { // access token 또는 refresh token이 헤더에 없는 경우
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

    //그룹 체크하자.
    let groups = [];
    
    user.getGroups()
    .then(data => {

      for (let i = 0; i < data.length; i++) {
        groups.push({id: data[i].id, name: data[i].name});
      }

      const token = sign(user, groups);
      const refreshToken = refresh();
      
      //토큰있으면 업데이트 한다. Insert Or Update
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