import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../src/forms/signin'
import SignUpPage from '../src/forms/signup';
import ResetPasswordPage from '../src/forms/forgetpassword';
import Dashboard from '../src/dashboard';
import AuthGuard from './AuthGuard';
import FlowvaSidebar from './sidebar';
import AuthCallback from '../src/services/AuthCallback';
import RedeemReward from './ui/redeeemreward';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forget-password" element={<ResetPasswordPage />} />
        <Route path="/redeem" element={<RedeemReward />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/sidebar" element={<FlowvaSidebar />} />
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;