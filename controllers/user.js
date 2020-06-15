const User = require('../models/user');

const findUser = userData => {
  User.find({ email: userData.email }).exec().then(result => {
    console.log(result);
    return result;
  });
};

module.exports = { findUser };
