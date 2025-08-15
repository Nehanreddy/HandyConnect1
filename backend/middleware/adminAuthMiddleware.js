const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

console.log('🔧 Admin middleware loaded');

const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ No admin token found or wrong format');
      return res.status(401).json({ message: 'Not authorized, no admin token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔐 Extracted Admin Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded Admin JWT:', decoded);

    // Check if token is for admin
    if (decoded.type !== 'admin') {
      console.log('❌ Token is not for admin');
      return res.status(401).json({ message: 'Not authorized, invalid admin token' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      console.log('❌ Admin not found or inactive');
      return res.status(401).json({ message: 'Invalid admin token, admin not found' });
    }

    req.admin = admin;
    console.log('✅ Admin authenticated:', admin.name);
    next();
  } catch (error) {
    console.error('❌ Admin token verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, admin token failed' });
  }
};

module.exports = { protectAdmin };
