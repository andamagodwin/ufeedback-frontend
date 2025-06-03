import React, { useState, useEffect } from 'react';

const Add = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    address: '',
    reason: '',
  });

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:3000/patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async () => {
    try {
      const res = await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Failed to add patient');
        return;
      }

      const newPatient = await res.json();
      setPatients((prev) => [newPatient, ...prev]);

      setFormData({
        name: '',
        phone: '',
        gender: '',
        address: '',
        reason: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Server error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patient List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Patient
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Address</th>
              <th className="p-3">Visit Reason</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan="5">
                  No patients added yet.
                </td>
              </tr>
            ) : (
              patients.map((p, idx) => (
                <tr key={p._id || idx} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{p.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Patient</h2>
            <div className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="reason"
                placeholder="Visit Reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPatient}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add;
