const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL)
  .then(console.log("DB Connected"))
  .catch((err) => console.log(err));


app.listen(process.env.PORT || 5000, () => {
  console.log("Started Server");
});