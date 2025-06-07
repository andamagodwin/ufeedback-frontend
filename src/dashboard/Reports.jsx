import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import DateRangePicker from '../components/DaterangePicker'; // assuming this is your custom one

const ReportsPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://ufeedback-backend.onrender.com/reports?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (range) => {
    setStartDate(range.start);
    setEndDate(range.end);
  };

  const csvHeaders = [
    { label: 'Date', key: 'date' },
    { label: 'Feedback Count', key: 'feedbackCount' },
    { label: 'Average Rating', key: 'averageRating' },
    { label: 'Excellent', key: 'excellent' },
    { label: 'Good', key: 'good' },
    { label: 'Poor', key: 'poor' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-[#233f92] mb-6">Reports</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
        {reportData && (
          <CSVLink
            filename={`ufeedback_report_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}.csv`}
            headers={csvHeaders}
            data={reportData.dailyBreakdown}
          >
            <button className="px-4 py-2 bg-[#233f92] text-white rounded-md hover:bg-[#1c327a] transition">
              Export CSV
            </button>
          </CSVLink>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : reportData ? (
        <div className="bg-white shadow p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-[#233f92] mb-4">Report Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Feedbacks" value={reportData.totalFeedbacks} />
            <StatCard label="Average Rating" value={reportData.averageRating.toFixed(2)} />
            <StatCard label="Excellent Ratings" value={reportData.excellent} />
            <StatCard label="Good Ratings" value={reportData.good} />
            <StatCard label="Poor Ratings" value={reportData.poor} />
            <StatCard label="Patients Received" value={reportData.totalPatients} />
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-2">Daily Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Feedback Count</th>
                  <th className="p-2 border">Average Rating</th>
                  <th className="p-2 border">Excellent</th>
                  <th className="p-2 border">Good</th>
                  <th className="p-2 border">Poor</th>
                </tr>
              </thead>
              <tbody>
                {reportData.dailyBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 border">{item.date}</td>
                    <td className="p-2 border">{item.feedbackCount}</td>
                    <td className="p-2 border">{item.averageRating.toFixed(2)}</td>
                    <td className="p-2 border">{item.excellent}</td>
                    <td className="p-2 border">{item.good}</td>
                    <td className="p-2 border">{item.poor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-red-500">Failed to load report data.</p>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-[#f0f4fb] p-4 rounded-xl shadow">
    <p className="text-gray-600 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-[#233f92]">{value}</p>
  </div>
);

export default ReportsPage;
