import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import WorkerNavbar from './components/WorkerNavbar';
import { useEffect, useState } from 'react';

// Wrapper to use hooks outside <Router>
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

const App = () => {
  const location = useLocation();
  const [isWorkerRoute, setIsWorkerRoute] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false); // 🆕 ADD

  useEffect(() => {
    setIsWorkerRoute(location.pathname.startsWith('/worker'));
    setIsAdminRoute(location.pathname.startsWith('/admin')); // 🆕 ADD
  }, [location]);

  return (
    <>
      {/* 🆕 UPDATE: Show WorkerNavbar for both worker and admin routes */}
      {(isWorkerRoute || isAdminRoute) ? <WorkerNavbar /> : <Navbar />}
      <AppRoutes />
    </>
  );
};

export default AppWrapper;
