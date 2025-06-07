import React from 'react';

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const handleStartChange = (e) => {
    const newStart = new Date(e.target.value);
    onChange({ start: newStart, end: endDate });
  };

  const handleEndChange = (e) => {
    const newEnd = new Date(e.target.value);
    onChange({ start: startDate, end: newEnd });
  };

  return (
    <div className="flex gap-2 items-center">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          className="border rounded px-2 py-1 text-sm"
          value={startDate.toISOString().split('T')[0]}
          onChange={handleStartChange}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">End Date</label>
        <input
          type="date"
          className="border rounded px-2 py-1 text-sm"
          value={endDate.toISOString().split('T')[0]}
          onChange={handleEndChange}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
