const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  _id          : mongoose.Schema.Types.ObjectId,
  customerId   : mongoose.Schema.Types.ObjectId,
  customerName : { type: String, required: true },
  vehicle      : { type: String, required: true },
  total        : { type: Number, required: true },
  numberOfDays : { type: Number, required: true },
  checkIn      : { type: Date },
  checkOut     : { type: Date },
  status       : { type: Boolean }
});

module.exports = mongoose.model('Transactions', transactionSchema);
