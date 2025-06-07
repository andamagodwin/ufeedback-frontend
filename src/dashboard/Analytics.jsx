import React, { useEffect } from 'react';
import useAnalyticsStore from '../store/analyticsStore';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#20a391', '#65b3c2', '#f87171'];

const Analytics = () => {
  const { analytics, loading, error, fetchAnalytics, fetched } = useAnalyticsStore();

  useEffect(() => {
    if (!fetched) fetchAnalytics();
  }, [fetched, fetchAnalytics]);
  


  const { feedbackTrends, ratingDistribution, categoryAverages, lowRatingsPerCategory } = analytics || {};

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#eef6f4] to-[#e8ebf5]">
      <h1 className="text-3xl font-bold mb-6 text-[#233f92]">Analytics Overview 📊</h1>

      {loading && <div className="text-gray-600">Loading analytics...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && analytics && (
        <div className="space-y-10">

          {/* Feedback Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-[#233f92] mb-4">Feedbacks Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feedbackTrends}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#20a391" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Distribution Pie */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-[#233f92] mb-4">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  dataKey="count"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {ratingDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Averages */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-[#233f92] mb-4">Average Rating per Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryAverages}>
                <XAxis dataKey="category" />
                <YAxis domain={[0, 3]} />
                <Tooltip />
                <Bar dataKey="average" fill="#65b3c2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Low Ratings per Category */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-[#233f92] mb-4">Low Ratings per Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lowRatingsPerCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="poorCount" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
};

export default Analytics;
