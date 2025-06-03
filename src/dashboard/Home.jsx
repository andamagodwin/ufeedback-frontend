import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authstore';

const Home = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://ufeedback-backend.onrender.com/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Welcome, {user?.email || 'User'} 👋</h1>
      {loading ? (
        <div className="text-gray-600">Loading dashboard...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Ratings" value={stats.totalRatings} />
          <StatCard title="Ratings Below 4" value={stats.lowRatings} />
          <StatCard title="Positive Feedbacks" value={stats.positiveFeedbacks} />
          <StatCard title="Negative Feedbacks" value={stats.negativeFeedbacks} />
          <StatCard title="Patients Received" value={stats.totalPatients} />
          <StatCard title="SMS Sent" value={stats.smsSent} />
        </div>
      ) : (
        <div className="text-red-500">Failed to load stats</div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded shadow text-center">
    <h2 className="text-xl font-medium text-gray-700">{title}</h2>
    <p className="text-2xl font-bold text-blue-700 mt-2">{value}</p>
  </div>
);

export default Home;
