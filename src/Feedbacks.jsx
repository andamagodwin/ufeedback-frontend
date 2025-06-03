import React, { useState } from 'react';
import { useParams } from 'react-router';

const Feedbacks = () => {
  const { id } = useParams();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return alert("Please select a rating");

    try {
      const res = await fetch('https://ufeedback-backend.onrender.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, comment, patientId: id })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 px-4 text-center">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Thank you for your feedback!</h2>
        <p className="text-gray-700">We appreciate you taking the time to help us improve our service.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Share your feedback</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          How would you rate your experience?
        </p>

        {/* Star Rating */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`w-8 h-8 cursor-pointer transition-transform ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09L5.64 12.545.76 8.91l6.214-.905L10 2.5l3.026 5.505 6.214.905-4.88 3.636 1.518 5.545z" />
            </svg>
          ))}
        </div>

        {/* Comment Box */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment..."
          className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedbacks;
