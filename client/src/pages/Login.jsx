import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCheck, KeyRound, CheckCircle, X, ShieldAlert, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, clearMustChangePasswordFlag } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.redirect || '/';

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingForgot, setSendingForgot] = useState(false);

  // Mandatory Change Password Modal State
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const loggedUser = await login(email, password);
      
      if (loggedUser.mustChangePassword) {
        setShowChangeModal(true);
        toast.info("Temporary password active. Please change your password to continue.", {
          style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
        });
      } else {
        toast.success(`Welcome back, ${loggedUser.name}!`, { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
        navigate(loggedUser.role === 'admin' ? '/admin' : redirectPath);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleSendForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setSendingForgot(true);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setShowForgotModal(false);
      setForgotEmail('');
      toast.success(res.message, {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' },
        autoClose: 8000
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "No account found with this email address.");
    } finally {
      setSendingForgot(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      toast.error("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setChangingPassword(true);
    try {
      const currentEmail = user?.email || email;
      await authService.changePassword(currentEmail, newPassword);
      clearMustChangePasswordFlag();
      setShowChangeModal(false);
      setNewPassword('');
      setConfirmPassword('');

      toast.success("Password changed successfully! Account secured.", {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
      
      navigate(user?.role === 'admin' ? '/admin' : redirectPath);
    } catch (err) {
      toast.error("Failed to update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleQuickDemoUser = async () => {
    setEmail('user@gmail.com');
    setPassword('User@123');
    await login('user@gmail.com', 'User@123');
    toast.success('Logged in as Customer (user@gmail.com)!', { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
    navigate(redirectPath);
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@gmail.com');
    setPassword('Admin@123');
    await login('admin@gmail.com', 'Admin@123');
    toast.success('Logged in as Admin (admin@gmail.com)!', { style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' } });
    navigate('/admin');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F5] relative">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-amber-900/10 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          {/* Prominent Large Clean Logo */}
          <img 
            src="/shoplogo.png" 
            alt="SWARNIKA Logo" 
            className="h-20 sm:h-24 w-auto mx-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
          <h1 className="font-brand-royal font-black text-2xl sm:text-3xl text-gold-royal tracking-widest uppercase">SWARNIKA Sign In</h1>
          <p className="text-xs text-amber-900 font-extrabold uppercase tracking-[0.25em]">LUXURY HERITAGE</p>
        </div>

        {/* Quick Demo Buttons */}
        {/* <div className="p-4 bg-amber-50/70 rounded-xl border border-gold/30 space-y-3">
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block text-center">
            Default Test Credentials (1-Click Fill)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleQuickDemoUser}
              className="bg-white border border-gold/40 hover:bg-gold/10 p-2.5 rounded-xl text-slate-900 font-bold flex flex-col items-center justify-center shadow-sm transition-colors"
            >
              <span className="flex items-center gap-1 text-gold"><UserCheck className="w-3.5 h-3.5" /> Customer</span>
              <span className="text-[9px] text-gray-500 font-mono mt-0.5">user@gmail.com</span>
              <span className="text-[9px] text-gray-400 font-mono">User@123</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="bg-white border border-gold/40 hover:bg-gold/10 p-2.5 rounded-xl text-slate-900 font-bold flex flex-col items-center justify-center shadow-sm transition-colors"
            >
              <span className="flex items-center gap-1 text-gold"><Crown className="w-3.5 h-3.5" /> Admin</span>
              <span className="text-[9px] text-gray-500 font-mono mt-0.5">admin@gmail.com</span>
              <span className="text-[9px] text-gray-400 font-mono">Admin@123</span>
            </button>
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="swarnika.luxury@gmail.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-gold"
              />
              <Mail className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-bold text-amber-900 hover:text-gold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-gold"
              />
              <Lock className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-sm py-3.5 rounded-xl shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-amber-800 hover:text-gold">
            Register Here
          </Link>
        </div>

      </div>

      {/* 1. FORGOT PASSWORD MODAL WITH OUTSIDE CLICK CLOSE */}
      {showForgotModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForgotModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white border-2 border-gold max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-6 text-slate-800 shadow-2xl relative">
            
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-100 rounded-full border-2 border-gold flex items-center justify-center mx-auto text-amber-800 shadow-gold-glow">
                <KeyRound className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-luxury font-bold text-2xl text-slate-900">
                SWARNIKA Password Reset
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Enter your registered email address. If an account exists, a random temporary password will be sent to your email.
              </p>
            </div>

            <form onSubmit={handleSendForgotPassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Registered Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="swarnika.luxury@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-3 pl-9 rounded-xl font-medium focus:border-gold focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingForgot}
                className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" /> {sendingForgot ? 'Sending Temporary Password...' : 'Send Temporary Password via Email'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* 2. MANDATORY CHANGE PASSWORD MODAL */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-500 max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-6 text-slate-800 shadow-2xl relative animate-fadeIn">
            
            <div className="w-16 h-16 bg-rose-100 rounded-full border-2 border-rose-400 flex items-center justify-center mx-auto text-rose-600 shadow-lg animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <span className="bg-rose-100 text-rose-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-rose-300 uppercase tracking-wider inline-block">
                Mandatory Security Requirement
              </span>
              <h2 className="font-luxury font-bold text-2xl text-slate-900">
                Change Temporary Password
              </h2>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                You logged in using a temporary password. For your account security, please set a new permanent password.
              </p>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Permanent Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-3 pl-9 rounded-xl font-medium focus:border-gold focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/30 text-slate-900 p-3 pl-9 rounded-xl font-medium focus:border-gold focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> {changingPassword ? 'Updating Password...' : 'Save New Password & Continue'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
