const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');

console.log('🔧 Worker middleware loaded');
console.log("🔐 Loaded JWT_SECRET:", process.env.JWT_SECRET);

const protectWorker = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ No token found or wrong format');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔐 Extracted Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded JWT:', decoded);

    const worker = await Worker.findById(decoded.id).select('-password');
    if (!worker) {
      console.log('❌ Worker not found from token');
      return res.status(401).json({ message: 'Invalid token, user not found' });
    }

    // 🆕 SET BOTH: This ensures compatibility with all controllers
    req.worker = worker;  // For booking controller (accept/reject)
    req.user = worker;    // For worker controller (profile)
    
    console.log('✅ Worker authenticated:', worker.name);
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protectWorker };
