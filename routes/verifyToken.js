const jwt = require('jsonwebtoken');

const verifToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if(err) res.status(401).json("잘못된 접근입니다.");
      req.user = user;
      next();
    })
  }else{
    return res.status(401).json("권한이 만료 되었습니다.");
  }
};

const verifTokenAndAuthorization = (req, res, next) => {
  verifToken(req,res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin){
      next();
    }else{
      res.status(403).json("권한이 없습니다.")
    }
  });
};

const verifTokenAndAdmin = (req, res, next) => {
  verifToken(req,res, () => {
    if(req.user.isAdmin){
      next();
    }else{
      res.status(403).json("권한이 없습니다.")
    }
  });
};

module.exports = {verifToken, verifTokenAndAuthorization, verifTokenAndAdmin};