const router = require('express').Router();
const Cart = require('../models/Cart');
const {verifToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

// 생성
router.post('/', verifToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 수정
router.patch('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const uqdatedCart = await Cart.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body
      }, 
        {new:true}
    );
    res.status(200).json(uqdatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 삭제
router.delete("/:id", verifyTokenAndAuthorization, async(req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json('장바구니를 삭제하였습니다.')
  } catch (err) {
    res.status(500).json(err);
  }
});

// 장바구니 가져오기
router.get('/find/:userid', verifyTokenAndAuthorization, async(req, res) => {
  try {
    const cart = await Cart.findOne({userId : req.params.userid})
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 모든 장바구니 가져오기
router.get('/', verifyTokenAndAdmin ,async(req, res) => {
  try {
    const carts = Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }  
});

module.exports = router;