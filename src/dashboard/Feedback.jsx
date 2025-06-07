import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import useFeedbackStore from '../store/feedbackStore';
import { io } from "socket.io-client";

const Feedback = () => {
  const { feedbacks, loading, error, fetched, fetchFeedbacks } = useFeedbackStore();
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!fetched) fetchFeedbacks();
  }, [fetched, fetchFeedbacks]);


  useEffect(() => {
  const socket = io("https://ufeedback-backend.onrender.com"); // or localhost for local dev

  socket.on("new-feedback", (newFeedback) => {
    // Update feedbacks in the store and let useEffect recalculate filtering
    useFeedbackStore.setState((state) => ({
      feedbacks: [newFeedback, ...state.feedbacks],
    }));
  });

  return () => {
    socket.disconnect(); // Clean up socket
  };
}, []);






  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filteredData = feedbacks.filter((fb) => {
      const name = fb.patientId?.name || '';
      const comment = fb.comment || '';
      const created = new Date(fb.createdAt);
      const matchesSearch =
        name.toLowerCase().includes(lowerSearch) || comment.toLowerCase().includes(lowerSearch);
      const withinDate =
        (!startDate || created >= new Date(startDate)) &&
        (!endDate || created <= new Date(endDate));
      return matchesSearch && withinDate;
    });
    setFiltered(filteredData);
  }, [searchTerm, startDate, endDate, feedbacks]);

  const exportCSV = () => {
    const csv = Papa.unparse(
      filtered.map((fb) => ({
        Name: fb.patientId?.name || 'Anonymous',
        Comment: fb.comment,
        ...fb.ratings,
        Date: new Date(fb.createdAt).toLocaleString(),
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `ufeedback-${Date.now()}.csv`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or comment"
          className="px-4 py-2 border rounded-xl w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="date"
            className="px-3 py-2 border rounded-xl"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="px-3 py-2 border rounded-xl"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={exportCSV}
          className="bg-[#20a391] hover:bg-[#1b8b7d] text-white px-4 py-2 rounded-xl font-medium transition-all"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="text-center text-blue-600 font-medium">Loading feedbacks...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500">No feedbacks found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((fb) => (
            <div key={fb._id} className="bg-white shadow rounded-xl p-4 border border-[#e2f4f1]">
              <h4 className="font-semibold text-lg mb-1 text-[#233f92]">
                {fb.patientId?.name || 'Anonymous'}
              </h4>
              <div className="text-sm space-y-1 mb-2">
                {Object.entries(fb.ratings).map(([cat, rate]) => (
                  <div key={cat} className="flex justify-between">
                    <span className="font-medium text-gray-600">{cat}</span>
                    <span>
                      {rate === 'Excellent'
                        ? '😍'
                        : rate === 'Good'
                        ? '🙂'
                        : rate === 'Poor'
                        ? '😞'
                        : ''}
                      {' ' + rate}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm italic">"{fb.comment || 'No comment'}"</p>
              <p className="text-gray-400 text-xs mt-2">{new Date(fb.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
