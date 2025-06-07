import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  stats: null,
  loading: true,
  error: null,
  fetched: false,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('https://ufeedback-backend.onrender.com/dashboard/stats');
      const data = await res.json();
      set({ stats: data, loading: false, fetched: true });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      set({ error: "Failed to fetch stats", loading: false });
    }
  },

  updateStats: (newStats) => {
    set((state) => ({
      stats: {
        ...state.stats,
        ...newStats,
      },
    }));
  },
}));

export default useDashboardStore;
