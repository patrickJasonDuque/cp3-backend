const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
  _id         : mongoose.Schema.Types.ObjectId,
  vehicleName : { type: String, required: true },
  price       : { type: Number, required: true },
  imageUrl    : { type: String, require: true },
  isAvailable : { type: Boolean, default: false },
  dateBooked  : { type: String, default: null }
});

module.exports = mongoose.model('Vehicles', vehicleSchema);
