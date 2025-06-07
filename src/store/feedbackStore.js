// stores/feedbackStore.js
import { create } from 'zustand';

const useFeedbackStore = create((set) => ({
  feedbacks: [],
  loading: false,
  error: null,
  fetched: false, // to prevent refetching

  fetchFeedbacks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('https://ufeedback-backend.onrender.com/feedback');
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const data = await res.json();
      set({ feedbacks: data, fetched: true });
    } catch (err) {
      set({ error: err.message || 'Something went wrong.' });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFeedbackStore;
