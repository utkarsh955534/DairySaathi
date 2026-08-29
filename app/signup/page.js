"use client"
import React, { useState } from 'react';

const API_BASE_URL = 'https://localhost:3000/v1/auth'; // Replace with your backend URL

export default function SignUp() {
  const [step, setStep] = useState('form');
  const [authType, setAuthType] = useState('email');
  const [formData, setFormData] = useState({ identifier: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAuthTypeSwitch = (type) => {
    setAuthType(type);
    setFormData({ ...formData, identifier: '' });
    setError('');
  };

  // 1. Send Registration Details & Request OTP
  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/register/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: authType, // "email" or "phone"
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code.');
      }

      // Transition to OTP screen upon success
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // 2. Submit OTP to Backend for Verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid or expired OTP.');
      }

      // Save token if returned directly
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP handler
  const handleResendOtp = async () => {
    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: formData.identifier, type: authType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to resend OTP.');
      alert('A new OTP has been sent.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-8 border border-green-900">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-700 tracking-tight">
            {step === 'otp' ? 'Verify Account' : step === 'success' ? 'Welcome!' : 'Create an Account'}
          </h2>
          <p className="text-black text-sm mt-2">
            {step === 'form' && 'Sign up to get started with our platform'}
            {step === 'otp' && `Enter the verification code sent to ${formData.identifier}`}
            {step === 'success' && 'Your account has been successfully verified.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="flex bg-white p-1 rounded-lg border border-green-900">
              <button
                type="button"
                onClick={() => handleAuthTypeSwitch('email')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  authType === 'email' ? 'bg-green-700 text-white shadow' : 'text-black hover:text-green-900'
                }`}
              >
                Use Email
              </button>
              <button
                type="button"
                onClick={() => handleAuthTypeSwitch('phone')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  authType === 'phone' ? 'bg-green-700 text-white shadow' : 'text-black hover:text-green-900'
                }`}
              >
                Use Phone Number
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1 capitalize">
                {authType === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <input
                type={authType === 'email' ? 'email' : 'tel'}
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder={authType === 'email' ? 'you@example.com' : '+1234567890'}
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl font-bold bg-white border border-green-900 rounded-lg text-black focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Complete'}
            </button>

            <div className="flex justify-between items-center text-xs text-black">
              <button type="button" onClick={() => setStep('form')} className="hover:text-green-700 transition">
                ← Change details
              </button>
              <button type="button" onClick={handleResendOtp} className="hover:text-green-700 transition">
                Resend Code
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-700/20 text-green-800 border border-green-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <button
              onClick={() => { window.location.href = '/dashboard'; }}
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}