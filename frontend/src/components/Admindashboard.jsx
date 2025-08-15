import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const AdminDashboard = () => {
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [approvedWorkers, setApprovedWorkers] = useState([]); // New state for approved workers
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [workersLoading, setWorkersLoading] = useState(false); // New loading state for worker management
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!admin) {
      navigate('/worker');
      return;
    }
    fetchDashboardData();
    fetchApprovedWorkers(); // Fetch approved workers on load
  }, [admin, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch pending workers and stats simultaneously
      const [workersResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/workers/pending', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const workersData = await workersResponse.json();
      const statsData = await statsResponse.json();

      if (workersData.success) {
        setPendingWorkers(workersData.workers);
      }
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch approved workers
  const fetchApprovedWorkers = async () => {
    setWorkersLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/workers/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setApprovedWorkers(data.workers);
      }
    } catch (error) {
      console.error('Error fetching approved workers:', error);
      toast.error('Failed to fetch approved workers');
    } finally {
      setWorkersLoading(false);
    }
  };

  // New function to remove worker
  const handleRemoveWorker = async (workerId, workerName) => {
    if (!window.confirm(`Are you sure you want to remove ${workerName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/workers/${workerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setApprovedWorkers(prev => prev.filter(worker => worker._id !== workerId));
        setStats(prev => ({ ...prev, approved: prev.approved - 1, total: prev.total - 1 }));
        toast.success(`${workerName} has been removed successfully!`);
      } else {
        toast.error('Failed to remove worker. Please try again.');
      }
    } catch (error) {
      console.error('Error removing worker:', error);
      toast.error('An error occurred while removing the worker');
    }
  };

  const handleApprove = async (workerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/workers/${workerId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setPendingWorkers(prev => prev.filter(worker => worker._id !== workerId));
        setStats(prev => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }));
        fetchApprovedWorkers(); // Refresh approved workers list
        toast.success('Worker approved successfully! 🎉');
      } else {
        toast.error('Failed to approve worker. Please try again.');
      }
    } catch (error) {
      console.error('Error approving worker:', error);
      toast.error('An error occurred while approving the worker');
    }
  };

  const handleReject = async () => {
    if (!selectedWorker || !rejectionReason.trim()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/workers/${selectedWorker._id}/reject`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        setPendingWorkers(prev => prev.filter(worker => worker._id !== selectedWorker._id));
        setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedWorker(null);
        toast.success(`${selectedWorker.name}'s application has been rejected`);
      } else {
        toast.error('Failed to reject worker. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting worker:', error);
      toast.error('An error occurred while rejecting the worker');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/worker');
  };

  const handleLogoClick = () => {
    navigate('/worker');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-xl fixed top-0 left-0 w-full z-50 backdrop-blur-sm border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Logo */}
              <button 
                onClick={handleLogoClick} 
                className="focus:outline-none cursor-pointer transform hover:scale-105 transition-transform duration-200 mr-6"
              >
                <img src={logo} alt="HandyConnect Logo" className="h-10 w-auto" />
              </button>
              
              {/* Admin Panel Title */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <span className="ml-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
                  Dashboard
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {admin?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">Welcome, {admin?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">Approved Workers</h3>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500">Total Workers</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
            </div>
          </div>

          {/* Pending Workers */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-purple-800">
                Pending Worker Approvals ({pendingWorkers.length})
              </h2>
            </div>
            
            {pendingWorkers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No pending worker approvals</p>
                <p className="text-gray-400 text-sm mt-1">All worker applications have been processed</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Worker Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingWorkers.map((worker) => (
                      <tr key={worker._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-purple-200"
                                src={worker.profilePhoto}
                                alt={worker.name}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/48/8B5CF6/FFFFFF?text=W';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                              <div className="text-sm text-gray-500">{worker.city}, {worker.state}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{worker.email}</div>
                          <div className="text-sm text-gray-500">{worker.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {worker.serviceType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(worker.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(worker._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWorker(worker);
                              setShowRejectModal(true);
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            ✗ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Worker Management Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h2 className="text-xl font-semibold text-green-800">
                Worker Management ({approvedWorkers.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage approved workers and their ratings</p>
            </div>

            {workersLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading workers...</p>
              </div>
            ) : approvedWorkers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-lg">No approved workers found</p>
                <p className="text-sm mt-1">Approved workers will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jobs Completed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approvedWorkers.map((worker) => (
                      <tr key={worker._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{worker.name}</div>
                          <div className="text-sm text-gray-500">{worker.serviceType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {worker.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {worker.jobCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${worker.averageRating < 3 ? 'text-red-600' : worker.averageRating >= 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {worker.averageRating > 0 ? `${worker.averageRating} ⭐` : 'No ratings'}
                            </span>
                            {worker.totalRatings > 0 && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({worker.totalRatings} ratings)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveWorker(worker._id, worker.name)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reject Worker Application</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject <strong className="text-gray-900">{selectedWorker.name}</strong>'s application?
            </p>
            <textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedWorker(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container - Add this at the bottom */}
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
  );
};

export default AdminDashboard;
