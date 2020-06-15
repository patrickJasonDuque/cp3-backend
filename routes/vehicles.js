const express = require('express');
const Vehicle = require('../models/vehicles');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
  Vehicle.find({}, (err, vehicles) => {
    const vehicleMap = [];

    vehicles.forEach(vehicle => {
      vehicleMap.push(vehicle);
    });

    res.status(200).json({ vehicleMap });
  });
});

router.post('/', (req, res) => {
  const newVehicle = new Vehicle({
    _id         : mongoose.Types.ObjectId(),
    vehicleName : req.body.vehicleName,
    price       : req.body.vehiclePrice,
    imageUrl    : req.body.vehicleImageUrl
  });
  newVehicle
    .save()
    .then(result => {
      res.status(201).json({ result });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Vehicle.deleteOne({ _id: id }).exec().then(result => {
    res.status(201).json({ result });
  });
});

module.exports = router;
