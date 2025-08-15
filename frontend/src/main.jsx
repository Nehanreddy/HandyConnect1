import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { WorkerAuthProvider } from './context/WorkerAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext'; // 🆕 ADD

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminAuthProvider> 
        <WorkerAuthProvider>
          <App />
        </WorkerAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
