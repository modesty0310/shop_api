const router = require('express').Router();
const User = require('../models/User');
const {verifToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

// 수정
router.patch('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if(req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password, 
      process.env.PASS_SEC
      ).toString();
  };
  try {
    console.log(req.body);
    const uqdatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body
      }, 
        {new:true}
    );
    res.status(200).json(uqdatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 삭제
router.delete("/:id", verifyTokenAndAuthorization, async(req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('아이디를 삭제하였습니다.')
  } catch (err) {
    res.status(500).json(err);
  }
});

// 유저 가져오기
router.get('/find/:id', verifyTokenAndAuthorization, async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 모든(관리자) 유저 가져오기
router.get('/', verifyTokenAndAdmin, async(req, res) => {
  const query = req.query.new;
  try {
    const users = query ? await User.find().sort({_id:-1}).limit(1) : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 사용자 상태 가져오기
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setUTCFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      // $match 조건에 만족해야 다음 파이프라인 단계로 전달
      // $gte : value 값보나 크거나 같은 값만 전달
      {$match: {createdAt : {$gte: lastYear}}},
      {
        $project: {
          month : { $month : "$createdAt"}
        }
      },
      {
        $group : {
          _id : "$month",
          total: {$sum : 1}
        }
      }
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;