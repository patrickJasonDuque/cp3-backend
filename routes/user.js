const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/user');

router.post('/signup', (req, res) => {
  // const user = userController.findUser(req.body.user);
  // if (user.length >= 1) {
  //   return res.status(409).json({ message: 'user already exist' });
  // }

  // bcrypt.hash(req.body.user.password, 10, (err, hash) => {
  //   if (err) {
  //     return res.status(500).json({ message: 'error making user' });
  //   }
  //   if (hash) {
  //     const user = new User({
  //       _id      : mongoose.Types.ObjectId(),
  //       email    : req.body.user.email,
  //       name     : req.body.user.name,
  //       password : hash
  //     });
  //     user
  //       .save()
  //       .then(result => {
  //         res.status(201).json({ result });
  //       })
  //       .catch(err => {
  //         res.status(500).json({ err });
  //       });
  //   }
  // });
  User.find({ email: req.body.email }).exec().then(result => {
    if (result.length >= 1) {
      return res.status(409).json({ message: 'user already exist' });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ message: 'error making user' });
        } else {
          const user = new User({
            _id      : mongoose.Types.ObjectId(),
            email    : req.body.email,
            name     : req.body.name,
            password : hash
          });
          user
            .save()
            .then(result => {
              res.status(201).json({ result });
            })
            .catch(err => {
              res.status(500).json({ err });
            });
        }
      });
    }
  });
});

router.post('/signin', (req, res) => {
  // const user = userController.findUser(req.body.user);
  // console.log(userController.findUser(req.body.user))
  // if (user.length < 1) {
  //   return res.status(401).json({ message: 'wrong username or password' });
  // }
  // bcrypt
  //   .compare(req.body.user.password, user[0].password, (err, result) => {
  //     if (err) {
  //       return res.status(401).json({ message: 'wrong username or password' });
  //     }
  //     if (result) {
  //       const token = jwt.sign({ email: user[0].email, userId: user[0]._id }, process.env.SECRET_KEY_JWT, {
  //         expiresIn : '1h'
  //       });
  //       return res.status(200).json({ token, _id: user[0]._id, name: user[0].name });
  //     }
  //     return res.status(401).json({ message: 'wrong username or password' });
  //   })
  //   .catch(err => {
  //     res.status(500).json({ err });
  //   });
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({ message: 'wrong username or password' });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'wrong username or password' });
        }
        if (result) {
          const token = jwt.sign({ email: user[0].email, userId: user[0]._id }, process.env.SECRET_KEY_JWT, {
            expiresIn : '1h'
          });
          return res.status(200).json({ token, _id: user[0]._id, name: user[0].name });
        }
        return res.status(401).json({ message: 'wrong username or password' });
      });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

module.exports = router;
