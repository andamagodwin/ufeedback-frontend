import React, { useEffect } from 'react';
import useAuthStore from '../store/authstore';
import useDashboardStore from '../store/dashboardStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/StatCard';

const Home = () => {
  const { user } = useAuthStore();
  const { stats, loading, error, fetchStats, fetched } = useDashboardStore();

  useEffect(() => {
    if (!fetched) fetchStats();
  }, [fetched, fetchStats]);






  const categoryChartData =
    stats?.categoryStats &&
    Object.entries(stats.categoryStats).map(([category, values]) => ({
      category,
      ...values,
    }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-[#233f92]">
        Welcome, {user?.email || 'User'} 👋
      </h1>

      {loading ? (
        <div className="text-gray-600">Loading dashboard...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
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
      )}
    </div>
  );
};

// const StatCard = ({ title, value, icon }) => (
//   <div className="bg-white p-6 rounded-2xl flex items-center space-x-4">
//     <div className="text-3xl">{icon}</div>
//     <div>
//       <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
//       <p className="text-2xl font-bold text-[#233f92]">{value}</p>
//     </div>
//   </div>
// );

export default Home;
