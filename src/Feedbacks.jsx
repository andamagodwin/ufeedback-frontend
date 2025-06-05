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

    console.log({id,ratings,comment})

    try {
      const res = await fetch('http://localhost:3000/feedback', {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-green px-4 text-center">
        <div className="bg-white p-6 rounded-xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-[#20a391] mb-3">🎉 Thank You!</h2>
          <p className="text-gray-700 text-lg">We appreciate your feedback and support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-3xl w-full max-w-3xl space-y-6">
        <div>
          <img src="/logo.jpg" alt="Feedback" className="w-32 mx-auto mb-4" />
        </div>

        {categories.map((cat) => (
          <div key={cat} className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <label className="block font-semibold text-gray-800 mb-2 text-lg">{cat}</label>
            <div className="flex justify-between text-xl sm:text-2xl">
              {['Excellent', 'Good', 'Poor'].map((level) => (
                <button
                  key={level}
                  className={`flex-1 py-2 mx-1 rounded-xl transition-all duration-300 border-2 ${
                    ratings[cat] === level
                      ? 'bg-[#20a391]/10 border-[#20a391] scale-105'
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
            className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-[#233f92]"
            rows="3"
            placeholder="Let us know more (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-[#233f92] hover:bg-[#1d3278] text-white font-semibold py-3 rounded-xl transition-transform hover:scale-105"
        >
          🚀 Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedbacks;
