import React, { useEffect, useState } from 'react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('https://ufeedback-backend.onrender.com/feedback');
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center">Feedback Summary</h2>
      <p className="text-center text-gray-600 mb-6">
        We value every response. Here’s what people are saying.
      </p>

      {loading ? (
        <div className="text-center text-blue-600 font-medium">Loading feedbacks...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center text-gray-500">No feedbacks submitted yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="bg-white shadow-md rounded-md p-4">
              <h4 className="font-semibold text-lg mb-2">
                {fb.patientId?.name || 'Anonymous'}
              </h4>
              <p className="text-yellow-500 mb-1">Rating: {fb.rating} / 5</p>
              <p className="text-gray-700 text-sm">{fb.comment || 'No comment'}</p>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(fb.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
