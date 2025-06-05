import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useAuthStore from '../store/authstore.js'; // Adjust the path as needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    

    try {

      if (password == "" || email == "" ){
        setError("All fields are required")
      }
      
      const res = await fetch('https://ufeedback-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        login(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container font-poppins max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

      {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 font-poppins">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
