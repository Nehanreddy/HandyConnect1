import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';
import Navbar from '../components/Navbar';
import RatingModal from '../components/RatingModal';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const MyServices = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState({
    pending: [],
    accepted: [],
    rejected: [],
    completed: [] // Only completed - no more rated category
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const response = await API.get('/bookings/my-services', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Merge completed and rated into just completed
      const processedBookings = {
        pending: response.data.pending || [],
        accepted: response.data.accepted || [],
        rejected: response.data.rejected || [],
        completed: [
          ...(response.data.completed || []),
          ...(response.data.rated || []) // Merge rated into completed
        ]
      };
      
      setBookings(processedBookings);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load your services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (bookingId, rating, review) => {
    try {
      const response = await API.put(`/bookings/${bookingId}/rate`, {
        rating,
        review
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      await fetchMyServices();
      toast.success('Thank you for your rating! 🌟');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const openRatingModal = (booking) => {
    setSelectedBooking(booking);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBooking(null);
  };

  const getStatusIcon = (status, hasRating = false) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'completed':
        // Show star if rated, checkmark if not rated
        return hasRating ? 
          <StarIconSolid className="w-5 h-5 text-purple-400" /> : 
          <CheckCircleIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status, hasRating = false) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700';
      case 'accepted':
        return 'bg-green-900/30 text-green-400 border border-green-700';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border border-red-700';
      case 'completed':
        return hasRating ? 
          'bg-purple-900/30 text-purple-400 border border-purple-700' :
          'bg-blue-900/30 text-blue-400 border border-blue-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border border-gray-700';
    }
  };

  const getStatusText = (status, hasRating = false) => {
    if (status === 'completed') {
      return hasRating ? 'Completed & Rated' : 'Completed';
    }
    return status;
  };

  const getAllBookings = () => {
    return [
      ...bookings.pending,
      ...bookings.accepted,
      ...bookings.rejected,
      ...bookings.completed
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getFilteredBookings = () => {
    if (activeTab === 'all') return getAllBookings();
    return bookings[activeTab] || [];
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="w-4 h-4 text-gray-400" />
          )
        ))}
        <span className="ml-2 text-sm text-gray-300">{rating}/5</span>
      </div>
    );
  };

  const renderWorkerDetails = (booking) => {
    if ((booking.status === 'accepted' || booking.status === 'completed') && booking.acceptedBy) {
      return (
        <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <h4 className="font-semibold text-green-300 mb-2 flex items-center">
            <UserIcon className="w-4 h-4 mr-2" />
            Worker Details
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300"><strong>Name:</strong> {booking.acceptedBy.name}</p>
            <p className="flex items-center text-gray-300">
              <PhoneIcon className="w-4 h-4 mr-1" />
              <strong>Phone:</strong> 
              <a href={`tel:${booking.acceptedBy.phone}`} className="ml-1 text-blue-400 hover:underline">
                {booking.acceptedBy.phone}
              </a>
            </p>
            <p className="text-gray-300"><strong>Service Type:</strong> {booking.acceptedBy.serviceType}</p>
            <p className="text-gray-300"><strong>City:</strong> {booking.acceptedBy.city}</p>
            <p className="text-xs text-green-400">
              <strong>Accepted:</strong> {new Date(booking.acceptedAt).toLocaleString()}
            </p>
            {booking.completedAt && (
              <p className="text-xs text-blue-400">
                <strong>Completed:</strong> {new Date(booking.completedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderRatingSection = (booking) => {
    if (booking.status === 'completed') {
      // Check if already rated
      if (booking.rating && booking.rating > 0) {
        // Already rated - show rating
        return (
          <div className="mt-4 p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
            <h4 className="font-semibold text-purple-300 mb-2">Your Rating</h4>
            <div className="space-y-2">
              {renderStars(booking.rating)}
              {booking.review && (
                <div>
                  <p className="text-sm text-purple-300 font-medium">Your Review:</p>
                  <p className="text-sm text-purple-200 italic">"{booking.review}"</p>
                </div>
              )}
              {booking.ratedAt && (
                <p className="text-xs text-purple-400">
                  Rated on {new Date(booking.ratedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      } else {
        // Not rated yet - show rate button
        return (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">Service Completed!</h4>
                <p className="text-sm text-blue-200">How was your experience? Rate this service.</p>
              </div>
              <button
                onClick={() => openRatingModal(booking)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ⭐ Rate Service
              </button>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-black pt-24 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading your services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-gray-200 pt-20">
        <div className="pt-8 px-6 max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-6 tracking-wide">My Services</h1>

          {/* Status Summary Cards - Updated to remove rated */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-700 border-l-4 border-l-yellow-500">
              <div className="flex items-center">
                <ClockIcon className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">{bookings.pending.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-700 border-l-4 border-l-green-500">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Accepted</p>
                  <p className="text-2xl font-bold text-white">{bookings.accepted.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-700 border-l-4 border-l-red-500">
              <div className="flex items-center">
                <XCircleIcon className="w-8 h-8 text-red-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-white">{bookings.rejected.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-700 border-l-4 border-l-blue-500">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">{bookings.completed.length}</p>
                  <p className="text-xs text-gray-500">
                    {bookings.completed.filter(b => b.rating).length} rated
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Updated to remove rated */}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {['all', 'pending', 'accepted', 'rejected', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {tab} ({tab === 'all' ? getAllBookings().length : bookings[tab]?.length || 0})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {getFilteredBookings().length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-2xl border border-purple-700">
                <WrenchScrewdriverIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-purple-400 mb-2">No services found</h3>
                <p className="text-gray-400">
                  {activeTab === 'all' 
                    ? "You haven't booked any services yet." 
                    : `No ${activeTab} services at the moment.`}
                </p>
              </div>
            ) : (
              getFilteredBookings().map((booking) => {
                const hasRating = booking.rating && booking.rating > 0;
                
                return (
                  <div key={booking._id} className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-purple-700">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-700 rounded-lg">
                          <WrenchScrewdriverIcon className="w-6 h-6 text-purple-200" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-purple-400">{booking.serviceType}</h3>
                          <p className="text-sm text-gray-400">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status, hasRating)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status, hasRating)}`}>
                          {getStatusText(booking.status, hasRating)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2"><strong>Problem:</strong></p>
                        <p className="text-gray-200">{booking.problem}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2 flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <strong>Location:</strong>
                        </p>
                        <p className="text-gray-200">{booking.serviceLocation.address}, {booking.serviceLocation.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2 flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <strong>Scheduled:</strong>
                        </p>
                        <p className="text-gray-200">{booking.date} at {booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2"><strong>Urgency:</strong></p>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          booking.urgency === 'Emergency' ? 'bg-red-900/30 text-red-400 border-red-700' :
                          booking.urgency === 'Urgent' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700' :
                          'bg-green-900/30 text-green-400 border-green-700'
                        }`}>
                          {booking.urgency}
                        </span>
                      </div>
                    </div>

                    {renderWorkerDetails(booking)}
                    {renderRatingSection(booking)}

                    {/* Status-specific messages */}
                    {booking.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-md">
                        <p className="text-sm text-yellow-300">
                          🕐 Waiting for a worker to accept your request. You'll be notified once someone accepts!
                        </p>
                      </div>
                    )}

                    {booking.status === 'rejected' && (
                      <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                        <p className="text-sm text-red-300">
                          ❌ This request was not accepted. You can book again for this service.
                        </p>
                      </div>
                    )}

                    {booking.status === 'accepted' && (
                      <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-md">
                        <p className="text-sm text-green-300">
                          ✅ Worker is on the way! Contact them if needed.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>

      {showRatingModal && selectedBooking && (
        <RatingModal
          booking={selectedBooking}
          onClose={closeRatingModal}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default MyServices;
