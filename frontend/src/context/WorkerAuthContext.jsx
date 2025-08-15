import { createContext, useContext, useState, useEffect } from 'react';

const WorkerAuthContext = createContext();

export const WorkerAuthProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ add loading state

  useEffect(() => {
    try {
      const stored = localStorage.getItem('worker');
      if (stored && stored !== 'undefined') {
        setWorker(JSON.parse(stored));
      }
    } catch (e) {
      console.error("❌ Error reading worker from localStorage:", e);
    } finally {
      setLoading(false); // ✅ render only after localStorage is checked
    }
  }, []);

  const loginWorker = (workerData) => {
    if (workerData?.token) {
      localStorage.setItem('worker', JSON.stringify(workerData));
      setWorker(workerData);
    } else {
      console.warn("⚠️ Tried to login but no token was provided:", workerData);
    }
    window.location.reload();

  };

  const logoutWorker = () => {
    localStorage.removeItem('worker');
    setWorker(null);
  };

  // ✅ Prevent rendering children until worker state is ready
  if (loading) return null;

  return (
    <WorkerAuthContext.Provider value={{ worker, loginWorker, logoutWorker }}>
      {children}
    </WorkerAuthContext.Provider>
  );
};

export const useWorkerAuth = () => useContext(WorkerAuthContext);
