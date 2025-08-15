import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';

const ServiceBookingPage = () => {
  const { serviceName } = useParams();
  const [form, setForm] = useState({
    name: '',
    contact: '',
    address: '',
    issue: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name.trim() || !form.contact.trim() || !form.address.trim() || !form.issue.trim()) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await API.post('/bookings', {
        service: serviceName,
        ...form
      });

      console.log('✅ Booking submitted:', response.data);
      toast.success(`${serviceName} service booked successfully! 🎉`);
      
      // Clear form after successful submission
      setForm({ name: '', contact: '', address: '', issue: '' });
    } catch (error) {
      console.error('❌ Booking failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || 'Failed to book service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-blue-50 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md max-w-xl w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700 capitalize">
          Book {serviceName} Service
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          disabled={submitting}
          className="w-full mb-4 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          disabled={submitting}
          className="w-full mb-4 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Service Address"
          value={form.address}
          onChange={handleChange}
          disabled={submitting}
          className="w-full mb-4 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />

        <textarea
          name="issue"
          placeholder="Describe your problem"
          value={form.issue}
          onChange={handleChange}
          rows={4}
          disabled={submitting}
          className="w-full mb-6 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full font-medium"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Booking...
            </>
          ) : (
            'Book Service'
          )}
        </button>

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
      </form>
    </div>
  );
};

export default ServiceBookingPage;
