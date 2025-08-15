const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  pincode: String,
  aadhaar: { type: String, required: true },
  profilePhoto: String,
  aadhaarPhoto: String,
  serviceType: { type: String, required: true },
  
  // 🔹 NEW APPROVAL FIELDS
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    default: null 
  },
  approvedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: null },
}, { timestamps: true });

WorkerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Worker', WorkerSchema);
