import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpSuccessProps {
  email: string;
  onResendEmail?: () => Promise<void>;
}

const SignUpSuccess: React.FC<SignUpSuccessProps> = ({ email, onResendEmail }) => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = React.useState(false);

  const handleResendEmail = async (): Promise<void> => {
    if (!onResendEmail) return;

    setIsResending(true);
    try {
      await onResendEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (error: unknown) {
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created Successfully!
          </h2>

          {/* Message */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              We've sent a verification email to:
            </p>
            <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
              {email}
            </p>
            <p className="text-gray-600 mt-4 text-sm">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          {/* Resend Email */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/signin')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Go to Login
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-transparent hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help?{' '}
              <a href="/support" className="text-purple-600 hover:text-purple-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;