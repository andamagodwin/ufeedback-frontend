import React, { useState, useEffect } from 'react';
import { FaPlus, FaSms, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import usePatientStore from '../store/patientStore';
import { Save, X } from 'lucide-react'

const Add = () => {
  const {
    patients,
    fetchPatients,
    addPatient,
  } = usePatientStore();

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    address: '',
    reason: '',
  });

  useEffect(() => {
    if (patients.length === 0) {
      fetchPatients();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async () => {
    setSaving(true);
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
        setSaving(false);
        return;
      }

      const newPatient = await res.json();
      addPatient(newPatient);
      setFormData({ name: '', phone: '', gender: '', address: '', reason: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Server error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPatient = (patient) => {
    setEditing(true);
    setEditId(patient._id);
    setFormData({
      name: patient.name || '',
      phone: patient.phone || '',
      gender: patient.gender || '',
      address: patient.address || '',
      reason: patient.reason || '',
    });
    setShowModal(true);
  };

  const handleUpdatePatient = async () => {
    setSaving(true);
    try {
      const res = await fetch(`https://ufeedback-backend.onrender.com/patients/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Failed to update patient');
        setSaving(false);
        return;
      }

      // Optionally update the patient in the store or refetch
      fetchPatients();
      setFormData({ name: '', phone: '', gender: '', address: '', reason: '' });
      setShowModal(false);
      setEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Server error');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
    setEditId(null);
    setFormData({ name: '', phone: '', gender: '', address: '', reason: '' });
  };

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt className="text-xl text-brand-green" />
          <span className="text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditing(false);
            setFormData({ name: '', phone: '', gender: '', address: '', reason: '' });
          }}
          className="flex items-center justify-center gap-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium shadow-lg rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
                  <img src="/add-patient.svg" alt="No Patients" className="w-[300px] mx-auto mb-2" />
                  <div className="space-y-2 text-center flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-slate-700">No patients registered today</h3>
                    <p className="text-slate-500 max-w-md">
                      Start by adding your first patient to begin managing medical records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentPatients.map((p, idx) => (
                <tr key={p._id || idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3 w-60">{p.reason}</td>
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
                      {p.smsStatus
                        ? p.smsStatus.charAt(0).toUpperCase() + p.smsStatus.slice(1)
                        : 'Pending'}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-brand-blue text-white rounded hover:bg-brand-green transition text-xs"
                      onClick={() => handleEditPatient(p)}
                    >
                      <FaEdit className="text-sm" /> Edit
                    </button>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#233f92]">
              {editing ? 'Edit Patient' : 'Add Patient'}
            </h2>
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
                onClick={handleCloseModal}
                className="relative flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
              >
                <span className="flex items-center justify-center relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  <X className="w-4 h-4" />
                  Cancel
                </span>
              </button>

              <button
                onClick={editing ? handleUpdatePatient : handleAddPatient}
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center justify-center"
                disabled={saving}
              >
                {saving ? (
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {editing ? 'Update' : 'Save'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add;