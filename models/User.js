'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: [true, 'Field cannot be empty']
  },
  password: String
});

userSchema.statics.hashPassword = function(pwdToHash) {
  return bcrypt.hash(pwdToHash, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
