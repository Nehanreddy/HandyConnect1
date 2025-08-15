import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '../context/WorkerAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

const WorkerSidebar = ({ onClose }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginWorker } = useWorkerAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post('/worker/login', { email, password });
      console.log(res);  // Log the full response to see what is returned
      
      loginWorker(res.data); // res.data already includes name, email, token
      toast.success(`Welcome back, ${res.data.name}! 👷‍♂️`);
      navigate(`/worker/home/${res.data.name}`);
      onClose();
    } catch (err) {
      console.error(err);  // Log the error
      toast.error(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 overflow-auto">
      <button 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors" 
        onClick={onClose}
        disabled={isLoading}
      >
        ✕
      </button>

      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-blue-600">Worker Login</h2>

          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          <div className="relative">
            <input
              className="w-full border border-gray-300 p-3 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="Password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/worker/reset-password'); // changed route
            }}
            disabled={isLoading}
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline block text-right transition-colors disabled:opacity-50"
          >
            Forgot password?
          </button>

          <p className="text-sm mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={() => { onClose(); navigate('/worker/signup'); }} 
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 underline transition-colors disabled:opacity-50"
            >
              Sign up
            </button>
          </p>
        </form>
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
  );
};

export default WorkerSidebar;
