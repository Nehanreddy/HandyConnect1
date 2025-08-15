import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";

const WorkerSignup = () => {
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
    aadhaar: "",
    serviceType: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePhoto || !aadhaarCard) {
      toast.error("Please upload both profile photo and Aadhaar card");
      return;
    }

    if (!form.serviceType) {
      toast.warning("Please select your service type");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    formData.append("profile", profilePhoto);
    formData.append("aadhaarCard", aadhaarCard);

    setLoading(true);

    try {
      await API.post("/worker/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Worker registration successful! 🎉 Please wait for admin approval.");
      // Clear form after successful submission
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
        aadhaar: "",
        serviceType: "",
      });
      setProfilePhoto(null);
      setAadhaarCard(null);
      navigate("/worker");
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white max-w-xl w-full rounded-lg shadow-lg p-10 border border-gray-200">
        <h2 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          Join as a Worker
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-6"
          encType="multipart/form-data"
          noValidate
        >
          {/* Full Name */}
          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="name"
            />
          </div>

          {/* Aadhaar Number */}
          <div className="col-span-2">
            <label
              htmlFor="aadhaar"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Aadhaar Number<span className="text-red-500">*</span>
            </label>
            <input
              id="aadhaar"
              name="aadhaar"
              type="text"
              value={form.aadhaar}
              onChange={handleChange}
              placeholder="1234 5678 9012"
              disabled={loading}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              inputMode="numeric"
              pattern="\d{12}"
              title="Enter 12 digit Aadhaar number"
            />
          </div>

          {/* Phone */}
          <div className="col-span-2">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              pattern="^[0-9+\-\s]{7,15}$"
              title="Enter a valid phone number"
              autoComplete="tel"
            />
          </div>

          {/* Email */}
          <div className="col-span-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-[2.65rem] text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-[2.65rem] text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="street-address"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="address-level2"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="address-level1"
            />
          </div>

          {/* Pincode */}
          <div className="col-span-2">
            <label
              htmlFor="pincode"
              className="block mb-2 text-sm font-semibold text-gray-700"
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
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="postal-code"
            />
          </div>

          {/* Service Type */}
          <div className="col-span-2">
            <label
              htmlFor="serviceType"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Service Type<span className="text-red-500">*</span>
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                Select Service Type
              </option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="Appliance Repair">Appliance Repair</option>
              <option value="Housekeeping">Housekeeping</option>
            </select>
          </div>

          {/* Profile Photo */}
          <div className="col-span-2">
            <label
              htmlFor="profilePhoto"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Profile Photo<span className="text-red-500">*</span>
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              disabled={loading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-describedby="profilePhotoHelp"
            />
            <small id="profilePhotoHelp" className="text-gray-500">
              Upload a clear profile photo.
            </small>
          </div>

          {/* Aadhaar Card */}
          <div className="col-span-2">
            <label
              htmlFor="aadhaarCard"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Aadhaar Card<span className="text-red-500">*</span>
            </label>
            <input
              id="aadhaarCard"
              type="file"
              accept="image/*"
              onChange={(e) => setAadhaarCard(e.target.files[0])}
              disabled={loading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-describedby="aadhaarCardHelp"
            />
            <small id="aadhaarCardHelp" className="text-gray-500">
              Upload scanned copy of your Aadhaar card.
            </small>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 py-3 rounded-lg font-semibold text-white shadow-md transition flex items-center justify-center ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          {/* Login Link */}
          <div className="col-span-2 text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/worker-login')}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
          theme="light"
        />
      </div>
    </div>
  );
};

export default WorkerSignup;
