import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { X, Home, User } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// You can move this list to a separate file if it's too large
const cities = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Bhopal",
  "Indore", "Patna", "Ranchi", "Raipur", "Surat", "Vadodara", "Varanasi",
  "Thane", "Nashik", "Agra", "Amritsar", "Jalandhar", "Ludhiana", "Guwahati",
  "Shillong", "Imphal", "Aizawl", "Kohima", "Itanagar", "Gangtok", "Panaji",
  "Bhubaneswar", "Cuttack", "Jamshedpur", "Dhanbad", "Noida", "Gurgaon",
  "Faridabad", "Chandigarh", "Mohali", "Trivandrum", "Kochi", "Coimbatore",
  "Madurai", "Tiruchirappalli", "Salem", "Warangal", "Vijayawada", "Visakhapatnam"
];

const ServiceBookingModal = ({ serviceType, onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingFor, setBookingFor] = useState('self');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    problem: '',
    urgency: 'Normal',
    location: '',
    city: '',
    otherName: '',
    otherPhone: '',
    otherAddress: '',
    otherCity: '',
    otherEmail: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  });

  const stepTitles = ['Service Details', 'Booking For', 'Schedule', 'Contact Info'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { name, phone, email, address, city } = res.data;

        setFormData((prev) => ({
          ...prev,
          name: name || '',
          phone: phone || '',
          email: email || '',
          location: address || '',
          city: city || ''
        }));
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error('Failed to load profile data');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.problem.trim() !== '' && formData.urgency.trim() !== '';
    }

    if (step === 2) {
      if (bookingFor === 'self') {
        return formData.location.trim() !== '' && formData.city.trim() !== '';
      } else {
        return (
          formData.otherName.trim() !== '' &&
          formData.otherPhone.trim() !== '' &&
          formData.otherEmail.trim() !== '' &&
          formData.otherAddress.trim() !== '' &&
          formData.otherCity.trim() !== ''
        );
      }
    }

    if (step === 3) {
      return formData.date.trim() !== '' && formData.time.trim() !== '';
    }

    if (step === 4) {
      return (
        formData.name.trim() !== '' &&
        formData.phone.trim() !== '' &&
        formData.email.trim() !== ''
      );
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.warning("Please fill in all required fields before continuing");
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You're not logged in. Please login first.");
      return;
    }

    setSubmitting(true);

    const serviceLocation = bookingFor === 'self'
      ? { address: formData.location, city: formData.city }
      : { address: formData.otherAddress, city: formData.otherCity };

    const bookingData = {
      serviceType,
      problem: formData.problem,
      urgency: formData.urgency,
      bookingFor,
      serviceLocation,
      date: formData.date,
      time: formData.time,
      contactName: bookingFor === 'self' ? formData.name : formData.otherName,
      contactPhone: bookingFor === 'self' ? formData.phone : formData.otherPhone,
      contactEmail: bookingFor === 'self' ? formData.email : formData.otherEmail,
    };

    console.log('🚀 Booking Data:', bookingData);

    // Optional: Check for missing fields
    const missingFields = Object.entries(bookingData).filter(
      ([key, value]) =>
        value === '' ||
        value === null ||
        (typeof value === 'object' &&
          (value.address === '' || value.city === ''))
    );

    if (missingFields.length > 0) {
      toast.error(`Missing required field: ${missingFields[0][0]}`);
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post('/api/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking submitted successfully! 🎉');
      onClose();
    } catch (err) {
      console.error('❌ Booking Error:', err);
      toast.error(err.response?.data?.msg || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">Request Service</Dialog.Title>
                    <p className="text-gray-500 mt-1 text-sm">{stepTitles[step - 1]}</p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={submitting}
                    className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Steps Form */}
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {step === 1 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Service Type</label>
                        <input
                          type="text"
                          disabled
                          value={serviceType}
                          className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-600 border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Describe the problem</label>
                        <textarea
                          name="problem"
                          value={formData.problem}
                          onChange={handleChange}
                          rows={4}
                          disabled={submitting}
                          placeholder="Describe the issue in detail..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none disabled:opacity-50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Urgency</label>
                        <select
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                          required
                        >
                          <option>Normal</option>
                          <option>Urgent</option>
                          <option>Emergency</option>
                        </select>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <label className="block text-sm font-medium mb-2">Who is this booking for?</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'self', label: 'For Myself', icon: Home },
                          { value: 'other', label: 'For Someone Else', icon: User }
                        ].map(({ value, label, icon: Icon }) => (
                          <label key={value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="bookingFor"
                              value={value}
                              checked={bookingFor === value}
                              onChange={(e) => setBookingFor(e.target.value)}
                              disabled={submitting}
                              className="sr-only"
                            />
                            <div className={`p-4 rounded-xl border-2 text-center ${bookingFor === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              } ${submitting ? 'opacity-50' : ''}`}>
                              <Icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                              <div className="font-medium text-gray-900">{label}</div>
                              <div className="text-xs text-gray-600">
                                {value === 'self' ? 'At my address' : 'Different address'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {bookingFor === 'self' ? (
                        <div className="bg-blue-50 p-4 rounded-xl mt-4">
                          <div className="font-medium text-blue-900 mb-1">Service Location</div>
                          <p className="text-blue-800">{formData.location}</p>
                          <p className="text-blue-700 text-sm">{formData.city}</p>
                        </div>
                      ) : (
                        <div className="space-y-4 mt-4">
                          <input
                            name="otherName"
                            value={formData.otherName}
                            onChange={handleChange}
                            disabled={submitting}
                            placeholder="Contact person name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                            required
                          />
                          <input
                            name="otherPhone"
                            value={formData.otherPhone}
                            onChange={handleChange}
                            disabled={submitting}
                            placeholder="Phone number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                            required
                          />
                          <input
                            name="otherEmail"
                            value={formData.otherEmail}
                            onChange={handleChange}
                            disabled={submitting}
                            placeholder="Email address"
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                            required
                          />
                          <input
                            name="otherAddress"
                            value={formData.otherAddress}
                            onChange={handleChange}
                            disabled={submitting}
                            placeholder="Service address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                            required
                          />
                          <select
                            name="otherCity"
                            value={formData.otherCity}
                            onChange={handleChange}
                            disabled={submitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                            required
                          >
                            <option value="">Select city</option>
                            {cities.map((city) => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <label className="block text-sm font-medium mb-2">Preferred Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={submitting}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                        required
                      />
                      <label className="block text-sm font-medium mb-2 mt-4">Preferred Time Slot</label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                        required
                      >
                        <option value="">Select</option>
                        <option value="morning">Morning (8AM–12PM)</option>
                        <option value="afternoon">Afternoon (12PM–5PM)</option>
                        <option value="evening">Evening (5PM–8PM)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                        required
                      />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                        required
                      />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50"
                        required
                      />
                    </>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={submitting}
                        className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={submitting}
                        className="ml-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 shadow-lg disabled:opacity-50 transition-all"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="ml-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 shadow-lg disabled:opacity-50 transition-all flex items-center"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Request'
                        )}
                      </button>
                    )}
                  </div>
                </form>

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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ServiceBookingModal;
