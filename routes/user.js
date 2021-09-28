const router = require('express').Router();
const User = require('../models/User');
const {verifToken, verifTokenAndAuthorization, verifTokenAndAdmin} = require('./verifyToken');

// 수정
router.patch('/:id', verifTokenAndAuthorization, async (req, res) => {
  if(req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password, 
      process.env.PASS_SEC
      ).toString();
  };
  try {
    console.log(req.body);
    const uqdateUser = await User.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body
      }, 
        {new:true}
    );
    res.status(200).json(uqdateUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 삭제
router.delete("/:id", verifTokenAndAuthorization, async(req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('아이디를 삭제하였습니다.')
  } catch (err) {
    res.status(500).json(err);
  }
});

// 유저 가져오기
router.get('/find/:id', verifTokenAndAuthorization, async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 모든(관리자) 유저 가져오기
router.get('/', verifTokenAndAdmin, async(req, res) => {
  const query = req.query.new;
  try {
    const users = query ? await User.find().sort({_id:-1}).limit(1) : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;