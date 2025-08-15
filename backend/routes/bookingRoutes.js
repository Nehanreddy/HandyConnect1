const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { protectWorker } = require('../middleware/workerAuthMiddleware');
const {
  createBooking,
  getMyBookings,
  getBookingsByCityAndService,
  updateBookingStatus,
  getUserBookingsWithWorkers,
  markBookingCompleted,
  rateBooking,
  getWorkerCompletedJobs,
  getWorkerAcceptedJobs  // 🆕 ADD: Import the new function
} = require('../controllers/bookingController');

// Create a new booking (authenticated user)
router.post('/', authMiddleware, createBooking);

// Get all bookings for the logged-in user
router.get('/my', authMiddleware, getMyBookings);

// Get user bookings with worker details
router.get('/my-services', authMiddleware, getUserBookingsWithWorkers);

// Get bookings by city and service type (for workers)
router.get('/by-city', getBookingsByCityAndService);

// Add worker authentication to status update
router.put('/:id/status', protectWorker, updateBookingStatus);

// Worker routes
router.put('/:id/complete', protectWorker, markBookingCompleted);
router.get('/worker/completed', protectWorker, getWorkerCompletedJobs);

// 🆕 NEW: Add the missing route for worker accepted jobs
router.get('/worker-accepted', getWorkerAcceptedJobs);

// User routes
router.put('/:id/rate', authMiddleware, rateBooking);

module.exports = router;
