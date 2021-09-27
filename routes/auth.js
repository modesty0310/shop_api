const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// 회원가입
router.post('/register', async (req, res) => {
  const newUser = new User({
    username : req.body.username,
    email : req.body.email,
    password : CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
  });
  console.log(req.body)
  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 로그인
router.get('/login', async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});

    !user && res.status(401).json("틀린 아이디 입니다.");

    const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const Originalpassword = hashPassword.toString(CryptoJS.enc.Utf8);

    Originalpassword !== req.body.password && res.status(401).json('틀린 비밀번호 입니다.');

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, 
    process.env.JWT_SEC,
    {expiresIn:"3d"}
    );

    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
