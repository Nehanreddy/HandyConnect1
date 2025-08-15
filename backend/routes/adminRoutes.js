const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getPendingWorkers,
  getAllWorkers,
  getWorkerDetails,
  approveWorker,
  rejectWorker,
  getDashboardStats,
  removeWorker,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// Public admin routes
router.post('/login', adminLogin);

// Protected admin routes
router.get('/dashboard/stats', protectAdmin, getDashboardStats);
router.get('/workers/pending', protectAdmin, getPendingWorkers);
router.get('/workers/all', protectAdmin, getAllWorkers);
router.get('/workers/:workerId', protectAdmin, getWorkerDetails);
router.put('/workers/:workerId/approve', protectAdmin, approveWorker);
router.put('/workers/:workerId/reject', protectAdmin, rejectWorker);
router.delete('/workers/:workerId', protectAdmin, removeWorker);

module.exports = router;
