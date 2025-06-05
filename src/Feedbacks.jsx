import React, { useState } from 'react';
import { useParams } from 'react-router';

const categories = [
  'Time Management',
  'Quality of service',
  'System/payment process',
  'Value for money',
  'Cleanliness',
];

const emojiMap = {
  Excellent: '😍',
  Good: '🙂',
  Poor: '😞',
};

const Feedbacks = () => {
  const { id } = useParams();
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(ratings).length !== categories.length)
      return alert('Please rate all categories.');

    try {
      const res = await fetch('https://ufeedback-backend.onrender.com/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: id,
          ratings,
          comment,
        }),
      });

      if (res.ok) setSubmitted(true);
      else alert('Failed to submit feedback.');
    } catch (err) {
      alert('Network error.');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <h2 className="text-3xl font-bold text-green-600 mb-3">🎉 Thank You!</h2>
          <p className="text-gray-700 text-lg">We appreciate your feedback and support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-3xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-purple-700">💬 Value Family Hospital Feedback Form</h1>

        {categories.map((cat) => (
          <div key={cat} className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <label className="block font-semibold text-gray-800 mb-2 text-lg">{cat}</label>
            <div className="flex justify-between text-xl sm:text-2xl">
              {['Excellent', 'Good', 'Poor'].map((level) => (
                <button
                  key={level}
                  className={`flex-1 py-2 mx-1 rounded-xl transition-all duration-300 border-2 ${
                    ratings[cat] === level
                      ? 'bg-purple-100 border-purple-600 scale-105'
                      : 'bg-white border-gray-300'
                  }`}
                  onClick={() => handleChange(cat, level)}
                >
                  {emojiMap[level]}
                  <div className="text-sm mt-1">{level}</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1 text-gray-800">💡 Additional Comments</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-300"
            rows="3"
            placeholder="Let us know more (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-transform hover:scale-105"
        >
          🚀 Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedbacks;
