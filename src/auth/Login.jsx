import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useAuthStore from '../store/authstore.js';

const EyeIcon = ({ open, onClick }) => (
  <button
    type="button"
    tabIndex={-1}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
    onClick={onClick}
    aria-label={open ? 'Hide password' : 'Show password'}
  >
    {open ? (
      // Eye open SVG
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      // Eye closed SVG
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.7 6.7A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.132M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
    )}
  </button>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 mr-2 text-brand-blue inline" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    if (password === "" || email === "") {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://ufeedback-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors?.email?.length > 0) setEmailError(data.errors.email);
        if (data.errors?.password?.length > 0) setPasswordError(data.errors.password);
      } else {
        login(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container font-poppins max-w-md mx-auto mt-20 p-6 bg-white rounded-md">
      <div>
        <img src="/logo.jpg" alt="Logo" className="w-52 mx-auto mb-4" />
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-center text-brand-blue">Login</h2>
      {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
      <div className="space-y-4">
        <div>
          {/* <label className="block text-sm font-medium mb-1 font-poppins">Email</label> */}
          <input
            type="email"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-500"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
        </div>
        <div className="relative">
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EyeIcon open={showPassword} onClick={() => setShowPassword(!showPassword)} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border px-3 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {passwordError && <div className="text-red-600 text-sm mt-1">{passwordError}</div>}
        </div>
        <div>
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white text-white py-2 cursor-pointer rounded hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <><Spinner /> Logging in...</> : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;