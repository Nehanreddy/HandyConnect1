const cloudinary = require('../config/cloudinary');
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET not set in environment variables.");
  process.exit(1);
}

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });
};

// Worker Signup (unchanged, but will set status to 'pending' by default)
const workerSignup = async (req, res) => {
  try {
    const {
      name, phone, email, password, confirmPassword,
      address, city, state, pincode, aadhaar, serviceType
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    if (!req.files?.profile || !req.files?.aadhaarCard) {
      return res.status(400).json({ msg: 'Profile and Aadhaar images are required' });
    }

    const existing = await Worker.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const profileUpload = await cloudinary.uploader.upload(req.files.profile[0].path, {
      folder: 'handyconnect/workers',
    });
    const aadhaarUpload = await cloudinary.uploader.upload(req.files.aadhaarCard[0].path, {
      folder: 'handyconnect/workers',
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save worker with 'pending' status (default from schema)
    const worker = await Worker.create({
      name, phone, email, password,
      address, city, state, pincode, aadhaar,
      profilePhoto: profileUpload.secure_url,
      aadhaarPhoto: aadhaarUpload.secure_url,
      serviceType,
    });

    // 🔹 Don't generate token immediately - worker needs approval first
    res.status(201).json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      status: worker.status,
      message: 'Registration successful! Please wait for admin approval before logging in.'
    });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ msg: 'Server error during signup' });
  }
};

// 🔹 UPDATED Worker Login - Check Approval Status
const workerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const worker = await Worker.findOne({ email });
    if (!worker || !(await bcrypt.compare(password, worker.password))) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // 🔹 Check approval status
    if (worker.status === 'pending') {
      return res.status(403).json({ 
        msg: 'Your account is pending admin approval. Please wait for approval before logging in.',
        status: 'pending'
      });
    }

    if (worker.status === 'rejected') {
      return res.status(403).json({ 
        msg: 'Your account has been rejected. Reason: ' + (worker.rejectionReason || 'Not specified'),
        status: 'rejected'
      });
    }

    // Only approved workers can login
    const token = generateToken(worker._id);
    res.json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      city: worker.city,
      serviceType: worker.serviceType,
      status: worker.status,
      token,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// Rest of your existing functions remain the same...
const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id).select('-password');
    if (!worker) return res.status(404).json({ msg: 'Worker not found' });

    res.json(worker);
  } catch (err) {
    console.error('❌ Error in getWorkerProfile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id);
    if (!worker) return res.status(404).json({ msg: 'Worker not found' });

    // Update all profile fields
    worker.name = req.body.name || worker.name;
    worker.phone = req.body.phone || worker.phone;
    worker.email = req.body.email || worker.email;
    worker.address = req.body.address || worker.address;
    worker.city = req.body.city || worker.city;
    worker.state = req.body.state || worker.state;
    worker.pincode = req.body.pincode || worker.pincode;
    worker.aadhaar = req.body.aadhaar || worker.aadhaar;

    // Handle password update if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      worker.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedWorker = await worker.save();
    
    // Return all updated fields
    res.json({
      _id: updatedWorker._id,
      name: updatedWorker.name,
      phone: updatedWorker.phone,
      email: updatedWorker.email,
      address: updatedWorker.address,
      city: updatedWorker.city,
      state: updatedWorker.state,
      pincode: updatedWorker.pincode,
      aadhaar: updatedWorker.aadhaar,
      serviceType: updatedWorker.serviceType,
      status: updatedWorker.status,
    });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


const resetWorkerPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    worker.password = await bcrypt.hash(newPassword, 10);
    await worker.save();

    res.json({ msg: 'Worker password reset successfully' });
  } catch (err) {
    console.error('❌ Error resetting password:', err);
    res.status(500).json({ msg: 'Server error while resetting password' });
  }
};

module.exports = {
  workerSignup,
  workerLogin,
  getWorkerProfile,
  updateWorkerProfile,
  resetWorkerPassword,
};
