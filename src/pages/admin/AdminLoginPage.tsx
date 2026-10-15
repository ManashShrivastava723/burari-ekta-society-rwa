import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { isDemoMode } from '../../lib/firebase';

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const { signIn, resetPassword } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('too-many-requests')) {
        setError('Too many login attempts. Please wait a moment before trying again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Enter your email address to reset your password.'); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2d62] to-[#1e3a8a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white text-xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-blue-200 text-sm">Burari Ekta Society RWA</p>
          </div>

          <div className="p-8">
            {isDemoMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800">
                <strong>Demo Mode:</strong> Use{' '}
                <code className="bg-amber-100 rounded px-1">demo@admin.com</code> /{' '}
                <code className="bg-amber-100 rounded px-1">demo1234</code> to explore the admin dashboard.
              </div>
            )}

            {resetMode ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Reset Password</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Enter your email to receive a password reset link.
                </p>
                {resetSent ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                    Password reset email sent. Check your inbox and follow the instructions.
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-4">
                    <Input
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}
                    <Button type="submit" loading={loading} className="w-full">
                      Send Reset Link
                    </Button>
                  </form>
                )}
                <button
                  onClick={() => { setResetMode(false); setError(''); setResetSent(false); }}
                  className="mt-4 text-sm text-[#1e3a8a] hover:underline block text-center"
                >
                  Back to login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Sign In</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Authorized administrators only.
                </p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="username"
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    Sign In
                  </Button>
                </form>

                {!isDemoMode && (
                  <button
                    onClick={() => { setResetMode(true); setError(''); }}
                    className="mt-3 text-sm text-[#1e3a8a] hover:underline block text-center"
                  >
                    Forgot your password?
                  </button>
                )}

                <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                  <Link to="/" className="text-sm text-gray-500 hover:text-[#1e3a8a] transition-colors">
                    ← Back to public website
                  </Link>
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  This area is for authorized RWA administrators only. Unauthorized access is prohibited.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
