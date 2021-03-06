const router = require('express').Router();
const Product = require('../models/Product');
const {verifToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

// 생성
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 수정
router.patch('/:id', verifyTokenAndAdmin, async (req, res) => {
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
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('상품을 삭제하였습니다.')
  } catch (err) {
    res.status(500).json(err);
  }
});

// 상품 가져오기
router.get('/find/:id', verifyTokenAndAdmin, async(req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 모든 상품 가져오기
router.get('/', async(req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if(qNew) {
      products = await Product.find().sort({createdAt: -1}).limit(5)
    } else if (qCategory){
      products = await Product.find({
        categories: {
          $in : [qCategory]
        }
      });
    }else {
      products = await Product.find();
    }
    
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }  
})

module.exports = router;