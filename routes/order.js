const router = require('express').Router();
const Order = require('../models/Order');
const {verifToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

// 생성
router.post('/', verifToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 수정
router.patch('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const uqdatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body
      }, 
        {new:true}
    );
    res.status(200).json(uqdatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 삭제
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('장바구니를 삭제하였습니다.')
  } catch (err) {
    res.status(500).json(err);
  }
});

// 주문현황 가져오기
router.get('/find/:userid', verifyTokenAndAuthorization, async(req, res) => {
  try {
    const Order = await Order.findOne({userId : req.params.userid})
    res.status(200).json(Order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 주문현황 가져오기
router.get('/', verifyTokenAndAdmin ,async(req, res) => {
  try {
    const Orders = Order.find();
    res.status(200).json(Orders);
  } catch (err) {
    res.status(500).json(err);
  }  
});

// 월별 주문 현황

module.exports = router;