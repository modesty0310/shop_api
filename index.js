const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//router
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');

mongoose.connect(process.env.DB_URL)
  .then(console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('error');
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Started Server");
});