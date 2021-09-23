const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [{
    productId: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    }
  }],
  amount: {type: String, required: true},
  address: {type: Object, required: true},
  status: {type: String, default: 'pendeing'}
},
  {timestamps: true}
);

module.exports = mongoose.model('Order', orderschema);