const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
  workerSignup,
  workerLogin,
 
  getWorkerProfile,
  updateWorkerProfile,
  resetWorkerPassword,
} = require('../controllers/workerAuthController');
const { protectWorker } = require('../middleware/workerAuthMiddleware');

router.post(
  '/signup',
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'aadhaarCard', maxCount: 1 }
  ]),
  workerSignup
);

router.post('/login', workerLogin);
router.post('/reset-password', resetWorkerPassword);
router.get('/profile', protectWorker, getWorkerProfile);
router.put('/profile', protectWorker, updateWorkerProfile);

module.exports = router;
