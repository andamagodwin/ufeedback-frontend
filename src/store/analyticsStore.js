import { create } from 'zustand';

const useAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,
  error: null,
  fetched: false,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:3000/analytics');
      const data = await res.json();

      set({
        analytics: data,
        loading: false,
        fetched: true,
      });
    } catch (err) {
      set({
        error: 'Failed to load analytics',
        loading: false,
        fetched: false,
      });
    }
  },
}));

export default useAnalyticsStore;
