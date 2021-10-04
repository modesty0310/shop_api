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
    const orders = await Order.find({userId : req.params.userid})
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 모든 주문현황 가져오기
router.get('/', verifyTokenAndAdmin ,async(req, res) => {
  try {
    const orders = Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }  
});

// 월별 주문 현황
router.get('/income', verifyTokenAndAdmin, async(req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {$match : {createdAt: {$gte : previousMonth}}},
      {
        $project : {
          month : { $month: "$createdAt"},
          sales: "$amount"
        },
      },
      {
        $group : {
          _id : "$month",
          total : { $sum : "$sales"}
        }
      }
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;