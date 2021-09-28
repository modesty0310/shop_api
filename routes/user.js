const router = require('express').Router();
const {verifToken, verifTokenAndAuthorization} = require('./verifyToken');

// 수정
router.patch('/:id', verifTokenAndAuthorization, async (req, res) => {
  if(req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password, 
      process.env.PASS_SEC
      ).toString();
  };

  try {
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
router.get('/:id', verifTokenAndAuthorization, async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;