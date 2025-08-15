import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';
import { Eye, EyeOff } from 'lucide-react'; // 👁️ icons

const AuthSidebar = ({ mode, onClose, switchMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await API.post('/auth/login', { email, password });

      // ✅ Save token to localStorage
      localStorage.setItem('token', res.data.token);

      // Update AuthContext state (if needed)
      login({
        ...res.data.user,
        token: res.data.token,
      });

      toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
      navigate(`/home/${res.data.user.name}`);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToSignupPage = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 overflow-auto">
      <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors" onClick={onClose}>✕</button>

      <form onSubmit={handleLogin} className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-blue-600">Login</h2>

        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />

        <div className="relative">
          <input
            className="w-full border border-gray-300 p-3 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/reset-password');
          }}
          className="text-sm text-blue-500 hover:text-blue-600 hover:underline block text-right transition-colors"
          disabled={isLoading}
        >
          Forgot password?
        </button>

        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={redirectToSignupPage} 
            className="text-blue-600 hover:text-blue-700 underline transition-colors"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
        
        <p className="text-sm mt-4 text-center text-gray-400">or</p>

        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/worker'); // Navigate to worker section
          }}
          className="text-blue-700 border border-blue-700 mt-4 w-full py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50"
          disabled={isLoading}
        >
          Work with us?
        </button>
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
    </div>
  );
};

export default AuthSidebar;
