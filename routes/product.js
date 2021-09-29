const router = require('express').Router();
const Product = require('../models/Product');
const {verifToken, verifTokenAndAuthorization, verifTokenAndAdmin} = require('./verifyToken');

// 생성
router.post('/', verifTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 수정
router.patch('/:id', verifTokenAndAdmin, async (req, res) => {
  try {
    const uqdatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body
      }, 
        {new:true}
    );
    res.status(200).json(uqdatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 삭제
router.delete("/:id", verifTokenAndAdmin, async(req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('상품을 삭제하였습니다.')
  } catch (err) {
    res.status(500).json(err);
  }
});

// 상품 가져오기
router.get('/find/:id', verifTokenAndAdmin, async(req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 모든 상품 가져오기
router.get('/', verifTokenAndAdmin, async(req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }  
})

module.exports = router;