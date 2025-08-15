import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import WorkerProfile from '../pages/WorkerProfile';
import ResetPassword from "../pages/ResetPassword";
import WorkerHome from '../pages/WorkerHome';
import WorkerSignup from '../pages/WorkerSignup';
import MyServices from '../pages/MyServices';
import WorkerDashboard from '../pages/WorkerDashboard';
import AdminDashboard from '../components/Admindashboard'; // 🆕 ADD: Import AdminDashboard
import { WorkerAuthProvider, useWorkerAuth } from '../context/WorkerAuthContext';
import { useAdminAuth } from '../context/AdminAuthContext'; // 🆕 ADD: Import useAdminAuth
import { useAuth } from '../context/AuthContext';
import WorkerResetPassword from '../pages/WorkerResetPassword';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages/ContactUs';
import Login from '../pages/Login';
import AdminWorkerList from '../components/AdminWorkerList';

const WorkerProtectedRoute = ({ element }) => {
  const { worker } = useWorkerAuth();
  return worker ? element : <Navigate to="/worker" />;
};

// 🆕 ADD: Admin Protected Route
const AdminProtectedRoute = ({ element }) => {
  const { admin } = useAdminAuth();
  return admin ? element : <Navigate to="/worker" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <WorkerAuthProvider>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home/:username" element={<Home />} />
        <Route path="/signup" element={user ? <Navigate to={`/home/${user.name}`} /> : <Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/my-services" element={user ? <MyServices /> : <Navigate to="/login" />} />
        <Route path="/worker/profile" element={<WorkerProfile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />

        {/* Worker routes */}
        <Route path="/worker" element={<WorkerHome />} />
        <Route path="/worker/signup" element={<WorkerSignup />} />
        <Route path="/worker/reset-password" element={<WorkerResetPassword />} />
        <Route path="/worker/home/:name" element={<WorkerProtectedRoute element={<WorkerHome />} />} />
        <Route path="/worker/dashboard" element={<WorkerProtectedRoute element={<WorkerDashboard />} />} />
        
        {/* 🆕 ADD: Admin routes */}
        <Route path="/admin/dashboard" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
      </Routes>
    </WorkerAuthProvider>
  );
};

export default AppRoutes;
