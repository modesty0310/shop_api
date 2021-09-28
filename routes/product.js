const router = require('express').Router();
const Product = require('../models/Product');
const {verifToken, verifTokenAndAuthorization, verifTokenAndAdmin} = require('./verifyToken');

// 생성
router.post('/', verifTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  console.log(newProduct);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 수정
router.patch('/:id', verifTokenAndAdmin, async (req, res) => {
  console.log(req.body);
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


module.exports = router;