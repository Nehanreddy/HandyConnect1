import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      toast.success("Account created successfully! Please login to continue. 🎉");
      
      // Clear form after successful signup
      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      
      // Navigate after a short delay to let user see the success message
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center px-4 py-16">
      <div className="bg-gray-900 max-w-xl w-full rounded-2xl shadow-xl p-10 border border-purple-700">
        <h2 className="text-4xl font-extrabold text-purple-400 mb-8 text-center tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6" noValidate>
          {/* Full Name */}
          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Phone Number */}
          <div className="col-span-2">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              disabled={loading}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              pattern="^[0-9+\-\s]{7,15}$"
              title="Enter a valid phone number"
            />
          </div>

          {/* Email */}
          <div className="col-span-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              disabled={loading}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              disabled={loading}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 pr-10 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-[2.65rem] text-gray-400 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Confirm Password<span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={loading}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 pr-10 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-[2.65rem] text-gray-400 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St"
              disabled={loading}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              disabled={loading}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              State
            </label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              disabled={loading}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Pincode */}
          <div className="col-span-2">
            <label
              htmlFor="pincode"
              className="block mb-2 text-sm font-semibold text-gray-300"
            >
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              disabled={loading}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 py-3 rounded-xl font-semibold text-white shadow-md transition flex items-center justify-center ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Submit"
            )}
          </button>

          {/* Login Link */}
          <div className="col-span-2 text-center mt-4">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                disabled={loading}
                className="text-purple-400 hover:text-purple-300 font-semibold focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Login here
              </button>
            </p>
          </div>
        </form>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
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
    </div>
  );
};

export default Signup;
