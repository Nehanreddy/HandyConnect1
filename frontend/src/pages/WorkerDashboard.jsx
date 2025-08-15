import React, { useEffect, useState } from 'react';
import WorkerNavbar from '../components/Workernavbar';
import { useWorkerAuth } from '../context/WorkerAuthContext';
import {
  StarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const WorkerDashboard = () => {
  const { worker } = useWorkerAuth();
  const [dashboardData, setDashboardData] = useState({
    jobs: [],
    stats: {
      totalCompletedJobs: 0,
      totalRatings: 0,
      averageRating: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!worker?.token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bookings/worker/completed', {
        headers: {
          'Authorization': `Bearer ${worker.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div>
        <WorkerNavbar />
        <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <WorkerNavbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your performance and customer feedback</p>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center">
                <CheckCircleIcon className="w-10 h-10 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Completed Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalCompletedJobs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center">
                <StarIconSolid className="w-10 h-10 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className={`text-3xl font-bold ${getRatingColor(dashboardData.stats.averageRating)}`}>
                    {dashboardData.stats.averageRating}/5.0
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="w-10 h-10 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalRatings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center">
                <ChartBarIcon className="w-10 h-10 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.totalCompletedJobs > 0 ? 
                      Math.round((dashboardData.stats.totalRatings / dashboardData.stats.totalCompletedJobs) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <span className="w-8 text-sm font-medium">{rating}</span>
                  <StarIconSolid className="w-4 h-4 text-yellow-400 mr-2" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${dashboardData.stats.totalRatings > 0 
                          ? (dashboardData.stats.ratingBreakdown[rating] / dashboardData.stats.totalRatings) * 100 
                          : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {dashboardData.stats.ratingBreakdown[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recent Jobs ({dashboardData.jobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Customer Reviews ({dashboardData.jobs.filter(job => job.review).length})
                </button>
              </nav>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {dashboardData.jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <CheckCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed jobs yet</h3>
                  <p className="text-gray-500">Complete some jobs to see your performance statistics here.</p>
                </div>
              ) : (
                dashboardData.jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.serviceType}</h3>
                        <p className="text-sm text-gray-500">
                          Completed on {new Date(job.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {job.rating ? (
                          <div className="flex items-center space-x-2">
                            {renderStars(job.rating)}
                            <span className="font-medium text-gray-900">{job.rating}/5</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                            Awaiting rating
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600"><strong>Customer:</strong> {job.user?.name}</p>
                        <p className="text-sm text-gray-600"><strong>Problem:</strong> {job.problem}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.serviceLocation.address}, {job.serviceLocation.city}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {job.date} at {job.time}
                        </p>
                      </div>
                    </div>

                    {job.review && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Customer Review:</h4>
                        <p className="text-blue-700 italic">"{job.review}"</p>
                        <p className="text-xs text-blue-600 mt-2">
                          Reviewed on {new Date(job.ratedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {dashboardData.jobs.filter(job => job.review).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <ChatBubbleLeftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500">Customer reviews will appear here once you complete jobs.</p>
                </div>
              ) : (
                dashboardData.jobs
                  .filter(job => job.review)
                  .map((job) => (
                    <div key={job._id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                            {job.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{job.user?.name}</p>
                            <p className="text-sm text-gray-500">{job.serviceType} Service</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(job.rating)}
                          <span className="font-medium text-gray-900">{job.rating}/5</span>
                        </div>
                      </div>
                      
                      <blockquote className="text-gray-700 italic border-l-4 border-indigo-500 pl-4 mb-3">
                        "{job.review}"
                      </blockquote>
                      
                      <p className="text-xs text-gray-500">
                        Reviewed on {new Date(job.ratedAt).toLocaleDateString()} • 
                        Job completed on {new Date(job.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
