
const {failure} = require('@common/result')

//isAuthenticated
exports.isAuth = (req , res , next) => {
  //console.log("middleware");
  if(req.isAuthenticated()){
      next();
  } else{
      return res.json(failure('1001', '인승실패'));
  }
}