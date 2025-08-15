const Admin = require('../models/Admin');
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

const generateAdminToken = (id) => {
  return jwt.sign({ id, type: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ msg: 'Invalid admin credentials' });
    }

    const token = generateAdminToken(admin._id);
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token,
    });
  } catch (err) {
    console.error('❌ Admin login error:', err);
    res.status(500).json({ msg: 'Server error during admin login' });
  }
};

// Get All Pending Workers
const getPendingWorkers = async (req, res) => {
  try {
    const pendingWorkers = await Worker.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: pendingWorkers.length,
      workers: pendingWorkers
    });
  } catch (err) {
    console.error('❌ Error fetching pending workers:', err);
    res.status(500).json({ msg: 'Server error fetching pending workers' });
  }
};



// Get Single Worker Details
const getWorkerDetails = async (req, res) => {
  try {
    const { workerId } = req.params;
    const worker = await Worker.findById(workerId)
      .select('-password')
      .populate('approvedBy', 'name email');
    
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }
    
    res.json({ success: true, worker });
  } catch (err) {
    console.error('❌ Error fetching worker details:', err);
    res.status(500).json({ msg: 'Server error fetching worker details' });
  }
};

// Approve Worker
const approveWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const adminId = req.admin._id;
    
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    if (worker.status !== 'pending') {
      return res.status(400).json({ msg: 'Worker is not in pending status' });
    }

    worker.status = 'approved';
    worker.approvedBy = adminId;
    worker.approvedAt = new Date();
    worker.rejectionReason = null; // Clear any previous rejection reason
    
    await worker.save();
    
    res.json({ 
      success: true, 
      message: 'Worker approved successfully',
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        status: worker.status
      }
    });
  } catch (err) {
    console.error('❌ Error approving worker:', err);
    res.status(500).json({ msg: 'Server error approving worker' });
  }
};

// Reject Worker
const rejectWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { reason } = req.body;
    
    if (!reason || reason.trim() === '') {
      return res.status(400).json({ msg: 'Rejection reason is required' });
    }
    
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    if (worker.status !== 'pending') {
      return res.status(400).json({ msg: 'Worker is not in pending status' });
    }

    worker.status = 'rejected';
    worker.rejectionReason = reason;
    worker.approvedBy = null;
    worker.approvedAt = null;
    
    await worker.save();
    
    res.json({ 
      success: true, 
      message: 'Worker rejected successfully',
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        status: worker.status,
        rejectionReason: worker.rejectionReason
      }
    });
  } catch (err) {
    console.error('❌ Error rejecting worker:', err);
    res.status(500).json({ msg: 'Server error rejecting worker' });
  }
};

// Get Admin Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Worker.countDocuments({ status: 'pending' }),
      Worker.countDocuments({ status: 'approved' }),
      Worker.countDocuments({ status: 'rejected' }),
      Worker.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        pending: stats[0],
        approved: stats[1],
        rejected: stats[2],
        total: stats[3]
      }
    });
  } catch (err) {
    console.error('❌ Error fetching dashboard stats:', err);
    res.status(500).json({ msg: 'Server error fetching stats' });
  }
};

// Replace your existing getAllWorkers method with this
const getAllWorkers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: 'approved' }; // Only show approved workers by default
    
    const workers = await Worker.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    // Get job counts and ratings for each worker
    const Booking = require('../models/Booking');
    const workersWithStats = await Promise.all(
      workers.map(async (worker) => {
        const completedJobs = await Booking.find({ 
          acceptedBy: worker._id, 
          status: 'completed' 
        });
        
        const jobCount = completedJobs.length;
        const ratedJobs = completedJobs.filter(job => job.rating && job.rating > 0);
        const averageRating = ratedJobs.length > 0 
          ? (ratedJobs.reduce((sum, job) => sum + job.rating, 0) / ratedJobs.length).toFixed(1)
          : 0;

        return {
          _id: worker._id,
          name: worker.name,
          email: worker.email,
          phone: worker.phone,
          city: worker.city,
          serviceType: worker.serviceType,
          jobCount,
          averageRating: parseFloat(averageRating),
          totalRatings: ratedJobs.length
        };
      })
    );
    
    res.json({
      success: true,
      count: workersWithStats.length,
      workers: workersWithStats
    });
  } catch (err) {
    console.error('❌ Error fetching workers:', err);
    res.status(500).json({ msg: 'Server error fetching workers' });
  }
};

// Add this new method
const removeWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    await Worker.findByIdAndDelete(workerId);
    
    res.json({ 
      success: true, 
      message: 'Worker removed successfully'
    });
  } catch (err) {
    console.error('❌ Error removing worker:', err);
    res.status(500).json({ msg: 'Server error removing worker' });
  }
};



module.exports = {
  adminLogin,
  getPendingWorkers,
  getAllWorkers,
  getWorkerDetails,
  approveWorker,
  rejectWorker,
  getDashboardStats,
  removeWorker,
};
