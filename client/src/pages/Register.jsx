import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [step, setStep] = useState(1); // 1 = Details, 2 = Verification OTP
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP to User Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters long.');
      return;
    }

    setSendingOtp(true);
    try {
      const res = await authService.sendOtp(email);
      toast.success(res.message || 'Verification OTP code sent to your email address! Please check your inbox.');
      setStep(2);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      toast.error('Please enter the valid 6-digit OTP verification code.');
      return;
    }

    setVerifying(true);
    try {
      await register(name, email, password, otp.trim());
      toast.success('🎉 Account registered and verified successfully!');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'OTP Verification failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F5]">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gold/30 shadow-2xl space-y-6 text-slate-800">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-50 rounded-full border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-gold-glow">
            <Crown className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-luxury font-bold text-2xl text-gold-gradient">
            {step === 1 ? 'Create SWARNIKA Account' : 'Verify Email Address'}
          </h1>
          <p className="text-xs text-gray-500">
            {step === 1 
              ? 'Register with real email verification to track 1-gram jewellery orders'
              : `Enter the 6-digit OTP code sent to ${email}`
            }
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-slate-900 text-gold shadow' : 'bg-emerald-100 text-emerald-800'}`}>
            1. Account Info {step > 1 && '✓'}
          </span>
          <span className="text-gray-300">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-slate-900 text-gold shadow' : 'bg-gray-100 text-gray-400'}`}>
            2. Email OTP Verification
          </span>
        </div>

        {/* STEP 1 FORM: User Details */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-gold font-medium"
                />
                <User className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address (Requires Verification)</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-gold font-medium"
                />
                <Mail className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-gold font-medium"
                />
                <Lock className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-sm py-3.5 rounded-xl shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sendingOtp ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" /> Sending OTP Code...
                </>
              ) : (
                <>
                  Send Verification OTP Code <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2 FORM: 6-Digit Email OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-5 text-xs animate-fadeIn">
            
            <div className="p-3.5 bg-amber-50 border border-gold/40 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">One-Time Password Sent!</strong>
                <span>We sent a 6-digit OTP to <strong>{email}</strong>. Enter the code below to activate your account.</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">6-Digit Verification OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1 2 3 4 5 6"
                className="w-full bg-amber-50/50 border border-gold/50 text-slate-900 font-mono font-bold text-center text-2xl tracking-[0.5em] py-3 rounded-xl focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-sm py-3.5 rounded-xl shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" /> Activating Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-900" /> Verify OTP & Create Account
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-slate-900 font-bold"
              >
                ← Edit Registration Info
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="text-gold font-bold hover:underline"
              >
                Resend OTP Code
              </button>
            </div>

          </form>
        )}

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-amber-900 hover:text-gold">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
