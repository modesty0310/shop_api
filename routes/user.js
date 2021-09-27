const router = require('express').Router();
const {verifToken, verifTokenAndAuthorization} = require('./verifyToken');

// 수정
router.put('/:id', verifTokenAndAuthorization, async (req, res) => {
  if(req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password, 
      process.env.PASS_SEC
      ).toString();
  };

  console.log(req.body);

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
})


module.exports = router;