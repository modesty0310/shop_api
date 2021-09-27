const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//router
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

mongoose.connect(process.env.DB_URL)
  .then(console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use('/user', userRouter);
app.use('/auth', authRouter);


app.listen(process.env.PORT || 5000, () => {
  console.log("Started Server");
});