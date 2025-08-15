import React, { useEffect, useState } from 'react';
import WorkerNavbar from '../components/WorkerNavbar';
import { useWorkerAuth } from '../context/WorkerAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const WorkerHome = () => {
  const { worker } = useWorkerAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!worker?.city || !worker?.serviceType || !worker?._id) return;

    setLoading(true);
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        fetch(`/api/bookings/by-city?city=${encodeURIComponent(worker.city)}&serviceType=${encodeURIComponent(worker.serviceType)}`),
        fetch(`/api/bookings/worker-accepted?workerId=${worker._id}`)
      ]);

      let allRequests = [];

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        allRequests = [...pendingData];
      }

      if (acceptedRes.ok) {
        const acceptedData = await acceptedRes.json();
        const acceptedJobs = acceptedData.filter(job => 
          !allRequests.some(req => req._id === job._id)
        );
        allRequests = [...allRequests, ...acceptedJobs];
      }

      setRequests(allRequests);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load service requests. Please refresh the page.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action) => {
    if (!worker?.token) {
      console.error('No worker token found');
      toast.error('Authentication required. Please login again.');
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${worker.token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const responseData = await res.json();
      console.log('✅ Booking status updated:', responseData);

      if (action === 'accepted') {
        const updatedRequests = requests.map((req) =>
          req._id === bookingId 
            ? { ...req, status: action, acceptedBy: worker._id, acceptedAt: new Date() } 
            : req
        );
        setRequests(updatedRequests);
        toast.success('Service request accepted! Complete the work and mark it as done. 🎉');
      } else if (action === 'rejected') {
        // Remove rejected jobs from the list
        setRequests(prev => prev.filter(req => req._id !== bookingId));
        toast.info('Service request rejected.');
      }

    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error(`Failed to ${action} the request: ${err.message}`);
    }
  };

  // Handle Mark Complete function
 const handleMarkComplete = async (bookingId) => {
  if (!worker?.token) {
    toast.error('Authentication required. Please login again.');
    return;
  }

  // Replace confirm() with SweetAlert2
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to mark this job as completed?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, mark it!',
    cancelButtonText: 'Cancel',
    showCloseButton: true, 
    focusCancel: true
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/api/bookings/${bookingId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${worker.token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || 'Failed to mark as completed');
    }

    setRequests(prev => prev.filter(req => req._id !== bookingId));
    toast.success('Job marked as completed! The user can now rate your service. ⭐');
  } catch (err) {
    console.error('Error marking job complete:', err);
    toast.error(`Failed to mark job as completed: ${err.message}`);
  }
};

  const handleWorkerSignup = () => {
    navigate('/worker-register');
  };

  const handleWorkerLogin = () => {
    navigate('/worker-login');
  };

  useEffect(() => {
    fetchRequests();
  }, [worker]);

  return (
    <div>
      <WorkerNavbar />
      <div className="max-w-5xl mx-auto p-6 pt-24">
        {worker ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center">
              {worker.serviceType} Requests in {worker.city || 'your city'}
            </h1>
            
            {/* Display worker info */}
            <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                Showing <strong>{worker.serviceType}</strong> requests for <strong>{worker.city}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Logged in as: <strong>{worker.name}</strong> (ID: {worker._id})
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading service requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-lg font-medium">No {worker.serviceType} requests in {worker.city} right now.</p>
                <p className="text-sm mt-2">Check back later for new service requests!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className={`p-6 rounded-xl shadow-md border transition-all ${
                      req.acceptedBy?.toString() === worker._id 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-blue-700">{req.serviceType}</h2>
                      <div className="flex gap-2">
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            req.urgency === 'Emergency'
                              ? 'bg-red-100 text-red-700'
                              : req.urgency === 'Urgent'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {req.urgency}
                        </span>
                        {/* Show if this job is accepted by current worker */}
                        {req.acceptedBy?.toString() === worker._id && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            YOUR JOB
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Problem:</strong> {req.problem}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Location:</strong> {req.serviceLocation?.address},{' '}
                      {req.serviceLocation?.city}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Date & Time:</strong> {req.date} at {req.time}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Contact:</strong> {req.contactName} ({req.contactPhone})
                    </p>

                    {/* Enhanced status rendering with proper worker check */}
                    {req.status === 'pending' ? (
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleAction(req._id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'rejected')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    ) : req.status === 'accepted' && req.acceptedBy?.toString() === worker._id ? (
                      <div className="mt-4">
                        <button
                          onClick={() => handleMarkComplete(req._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-4 font-medium"
                        >
                          ✅ Mark as Completed
                        </button>
                        <div className="text-sm text-green-600 mt-2 font-medium">
                          ✅ You accepted this request. Complete the work and mark it as done.
                        </div>
                      </div>
                    ) : req.status === 'accepted' ? (
                      <div className="mt-4 text-sm font-medium text-orange-600">
                        ⚠️ This request has been accepted by another worker.
                      </div>
                    ) : (
                      <div className="mt-4 text-sm font-medium text-gray-700">
                        Status:{' '}
                        <span
                          className={`inline-block px-3 py-1 rounded-full ${
                            req.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : req.status === 'rated'
                              ? 'bg-purple-100 text-purple-700'
                              : req.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {req.status}
                        </span>
                        {req.status === 'completed' && (
                          <p className="text-xs text-blue-600 mt-1">
                            ✅ Work completed! Waiting for user rating.
                          </p>
                        )}
                        {req.status === 'rated' && (
                          <p className="text-xs text-purple-600 mt-1">
                            ⭐ User has rated your service! Check your dashboard.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Context shown if worker is not logged in
          <div className="max-w-4xl mx-auto">
            {/* Hero Section for Workers */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Join <span className="text-purple-600">Handy Connect</span> as a Professional
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Turn your skills into income. Connect with customers who need your expertise and grow your business with our trusted platform.
              </p>
            </div>

            {/* What We Expect Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
                What We Expect from Our Workers
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Professional Excellence</h3>
                      <p className="text-gray-600 text-sm">Deliver high-quality work with attention to detail and commitment to customer satisfaction.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Reliability & Punctuality</h3>
                      <p className="text-gray-600 text-sm">Show up on time, complete jobs as promised, and communicate clearly with customers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Safety First</h3>
                      <p className="text-gray-600 text-sm">Follow all safety protocols and use proper tools and equipment for every job.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Honest Pricing</h3>
                      <p className="text-gray-600 text-sm">Provide fair, transparent pricing with no hidden fees or unexpected charges.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Customer Service</h3>
                      <p className="text-gray-600 text-sm">Treat customers with respect, listen to their needs, and go the extra mile to exceed expectations.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Continuous Learning</h3>
                      <p className="text-gray-600 text-sm">Stay updated with industry best practices and new techniques in your field.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Why Choose Handy Connect?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Flexible Earnings</h3>
                  <p className="text-gray-600 text-sm">Work on your schedule and earn competitive rates for your expertise.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Trusted Platform</h3>
                  <p className="text-gray-600 text-sm">Connect with verified customers in your area through our secure platform.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Grow Your Business</h3>
                  <p className="text-gray-600 text-sm">Build your reputation, gain regular customers, and expand your service area.</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-6 text-purple-100">
                Join thousands of professionals who are already earning with Handy Connect
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                {/* 🔄 UPDATED: Route to worker registration page */}
                <button 
                  onClick={handleWorkerSignup}
                  className="w-full sm:w-auto bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign Up as Worker
                </button>
                <button 
                  onClick={handleWorkerLogin}
                  className="w-full sm:w-auto border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Already have an account?
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Active Workers</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
                <div className="text-gray-600">Jobs Completed</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        )}

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
          theme="light"
        />
      </div>
    </div>
  );
};

export default WorkerHome;

