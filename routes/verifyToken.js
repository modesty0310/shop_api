const jwt = require('jsonwebtoken');

const verifToken = (req,res,next) => {
  const authHeader = req.headers.token;
  console.log(authHeader);
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if(err) res.status(401).json("권한이 없습니다.");
      req.user = user;
      next();
    })
  }else{
    return res.status(401).json("권한이 없습니다.");
  }
};

const verifTokenAndAuthorization = (req, res, next) => {
  verifToken(req,res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin){
      console.log(req.user);
      next();
    }else{
      res.status(403).json("권한이 없습니다.")
    }
  });
};

module.exports = {verifToken, verifTokenAndAuthorization};