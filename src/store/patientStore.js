import { create } from 'zustand';

const usePatientStore = create((set) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`https://ufeedback-backend.onrender.com/patients?date=${today}`);
      const data = await res.json();
      set({ patients: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch patients', loading: false });
    }
  },

  addPatient: (newPatient) =>
    set((state) => ({ patients: [newPatient, ...state.patients] })),
}));

export default usePatientStore;
