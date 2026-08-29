"use client"
import React, { useState } from 'react';

export default function Login() {
  const [authType, setAuthType] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  // Switch between Email and Phone mode
  const handleAuthTypeSwitch = (type) => {
    setAuthType(type);
    setFormData({ ...formData, identifier: '' });
    setError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate Login API call
    setTimeout(() => {
      setLoading(false);
      alert(`Logged in successfully as ${formData.identifier}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="max-w-md w-full bg-green-100 rounded-2xl shadow-xl p-8 border border-green-900">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-700 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-black text-sm mt-2">
            Sign in to access your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Mode Switcher Toggle */}
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

          {/* Email / Phone Field */}
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
              placeholder={authType === 'email' ? 'you@example.com' : '+1 234 567 8900'}
              className="w-full px-4 py-2.5 bg-white border border-green-900 rounded-lg text-black placeholder-slate-500 focus:outline-none text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <a
                href="#forgot-password"
                className="text-xs text-green-800 hover:text-green-950 font-medium transition"
              >
                Forgot Password?
              </a>
            </div>
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-green-700 focus:ring-green-700 border-green-900 rounded accent-green-700 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-xs text-black cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <hr className='mt-6 bg-green-900 ' />

        {/* Footer Link to Sign Up */}
        <div className="text-center mt-5 text-md text-black">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-green-800 font-bold hover:underline transition"
          >
            <br /><button className="w-full mt-2 py-2.5 px-4 bg-green-700 hover:bg-green-900 text-white font-medium rounded-lg shadow-lg transition-colors duration-200 focus:outline-none disabled:opacity-50">Sign up</button>
          </a>
        </div>

      </div>
    </div>
  );
}