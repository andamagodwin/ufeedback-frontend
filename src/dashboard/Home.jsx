import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authstore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  const categoryChartData =
    stats?.categoryStats &&
    Object.entries(stats.categoryStats).map(([category, values]) => ({
      category,
      ...values,
    }));

  return (
    <div className="p-6 bg-gradient-to-br from-[#e6f9f5] to-[#e5e9f8] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-[#233f92]">
        Welcome, {user?.email || 'User'} 👋
      </h1>

      {loading ? (
        <div className="text-gray-600">Loading dashboard...</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Feedbacks" value={stats.totalFeedbacks} icon="💬" />
            <StatCard title="Total Ratings" value={stats.totalRatings} icon="⭐" />
            <StatCard title="Low Ratings" value={stats.lowRatings} icon="⚠️" />
            <StatCard title="Positive Ratings" value={stats.positiveRatings} icon="👍" />
            <StatCard title="Negative Ratings" value={stats.negativeRatings} icon="👎" />
            <StatCard title="Patients Received" value={stats.totalPatients} icon="🧍" />
            <StatCard title="SMS Sent" value={stats.smsSent} icon="📩" />
          </div>

          {categoryChartData && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold text-[#233f92] mb-4">
                Category Rating Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Excellent" fill="#20a391" />
                  <Bar dataKey="Good" fill="#65b3c2" />
                  <Bar dataKey="Poor" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="text-red-500">Failed to load stats</div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow flex items-center space-x-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-[#233f92]">{value}</p>
    </div>
  </div>
);

export default Home;
