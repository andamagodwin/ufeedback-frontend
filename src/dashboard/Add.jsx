import React, { useState, useEffect } from 'react';
import { FaPlus, FaSms, FaCalendarAlt } from 'react-icons/fa';

const Add = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    address: '',
    reason: '',
  });

  const fetchPatients = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`https://ufeedback-backend.onrender.com/patients?date=${today}`);
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
      const res = await fetch('https://ufeedback-backend.onrender.com/patients', {
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
      setFormData({ name: '', phone: '', gender: '', address: '', reason: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Server error');
    }
  };

  // Pagination
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#233f92]">Today's Patients</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt className="text-xl" />
          <span className="text-sm">{new Date().toLocaleDateString()}</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#233f92] text-white px-4 py-2 rounded hover:bg-[#1a2e6e]"
        >
          <FaPlus /> Add Patient
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#f4f7fc] text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Address</th>
              <th className="p-3">Visit Reason</th>
              <th className="p-3">SMS Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No patients added yet today.
                </td>
              </tr>
            ) : (
              currentPatients.map((p, idx) => (
                <tr key={p._id || idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{p.reason}</td>
                  <td className="p-3">
                    <div
                     className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      p.smsStatus === 'sent'
                      ? 'bg-green-100 text-green-700'
                      : p.smsStatus === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <FaSms className="text-sm" />
                    {p.smsStatus ? p.smsStatus.charAt(0).toUpperCase() + p.smsStatus.slice(1) : 'Pending'}
                  </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-[#233f92] text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#233f92]">Add Patient</h2>
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
                className="bg-[#233f92] text-white px-4 py-2 rounded hover:bg-[#1a2e6e]"
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
