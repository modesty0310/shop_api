const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const newUser = new User({
    username : req.body.username,
    email : req.body.email,
    password : req.body.password,
  });
  console.log(req.body)
  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
