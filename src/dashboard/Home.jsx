import React, { useEffect } from 'react';
import useAuthStore from '../store/authstore';
import useDashboardStore from '../store/dashboardStore';
import usePatientStore from '../store/patientStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/StatCard';

const Home = () => {
  const { user } = useAuthStore();
  const { stats, loading, error, fetchStats, fetched } = useDashboardStore();
  const { fetchPatients, patients } = usePatientStore();
  // Fetch patients only if the user is a receptionist


  useEffect(() => {
    if (user?.role === 'receptionist' && patients.length === 0) {
      fetchPatients();
    }
  }, []);



  useEffect(() => {
    if (!fetched && user?.role === 'admin') {
      fetchStats(); // Only fetch stats for admin
    }
  }, [fetched, fetchStats, user]);

  const categoryChartData =
    stats?.categoryStats &&
    Object.entries(stats.categoryStats).map(([category, values]) => ({
      category,
      ...values,
    }));

  const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-8 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white p-6 rounded-xl shadow animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  );

  const renderAdminDashboard = () => {
    if (loading) {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonChart />
        </>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
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
    );
  };

  const renderReceptionistDashboard = () => (
    <>
      <div className="text-2xl font-semibold text-[#233f92] mb-4">
        Welcome, {user?.email} 👋
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Patients Today" value={patients.length} icon="🧍" />
        <StatCard title="SMS Sent" value="0" icon="📩" />
      </div>

      
    </>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {user?.role === 'admin'
        ? renderAdminDashboard()
        : renderReceptionistDashboard()}
    </div>
  );
};

export default Home;
