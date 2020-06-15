const express = require('express');
const Transaction = require('../models/transaction');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SK);
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  Transaction.find({}, (err, transaction) => {
    const transactionMap = [];

    transaction.forEach(t => {
      transactionMap.push(t);
    });

    res.status(200).json({ transactionMap });
  });
});

router.post('/', (req, res) => {
  const newTransaction = new Transaction({
    _id          : mongoose.Types.ObjectId(),
    customerId   : req.body.customerId,
    customerName : req.body.customerName,
    vehicle      : req.body.vehicle,
    total        : req.body.total,
    numberOfDays : req.body.numberOfDays,
    dateFrom     : req.body.checkIn,
    dateTo       : req.body.checkOut,
    status       : req.body.status
  });
  newTransaction
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
  Transaction.deleteOne({ _id: id }).exec().then(console.log);
});

router.post('/stripe', (req, res) => {
  User.findOne({ _id: req.body.id }).then(user => {
    if (!user) {
      res.status(400).json({ message: 'No user' });
    } else {
      if (!user.customerId) {
        stripe.customers
          .create({ email: user.email })
          .then(customer => {
            return User.findByIdAndUpdate({ _id: user._id }, { customerId: customer.id }, { new: true });
          })
          .then(user => {
            return stripe.customers.retrieve(user.customerId);
          })
          .then(customer => {
            return stripe.customers.createSource(customer.id, { source: 'tok_visa' });
          })
          .then(source => {
            return stripe.charges
              .create({
                amount   : req.body.total * 100,
                currency : 'php',
                customer : source.customer
              })
              .then(charge => res.status(201).json({ charge }))
              .catch(err => res.status(500).json({ err }));
          });
      } else {
        stripe.charges
          .create({
            amount   : req.body.total * 100,
            currency : 'php',
            customer : user.customerId
          })
          .then(charge => {
            const newTransaction = new Transaction({
              _id          : mongoose.Types.ObjectId(),
              customerId   : user._id,
              customerName : user.name,
              vehicle      : req.body.vehicle,
              total        : req.body.total,
              numberOfDays : req.body.numberOfDays,
              checkIn      : req.body.checkIn,
              checkOut     : req.body.checkOut,
              status       : true
            });
            newTransaction.save().then(result => {
              res.status(201).json({ charge: charge.receipt_url, result });
            });
          })
          .catch(err => res.status(500).json({ err }));
      }
    }
  });
});

module.exports = router;
