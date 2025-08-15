const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    default: 'customer' // can be extended later
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  state: String,
  pincode: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
