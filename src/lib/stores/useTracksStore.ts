import { create } from 'zustand';
import api from '@/lib/api';
import { TrackStore, FiltersState } from '@/types';


export const useTrackStore = create<TrackStore>((set) => ({

  tracks: [],
  loading: false,

  fetchTracks: async (filters = {}) => {
    set({ loading: true });
    try {
      const res = await api.get('/tracks', {params: filters});
      set({ tracks: res.data.data });
    } catch (err) {
      console.error('Error fetching tracks:', err);
    } finally {
      set({ loading: false });
    }
  },

  deleteTrack: async (id: number) => {
    try {
      await api.delete(`/tracks/${id}`);
      set((state) => ({
        tracks: state.tracks.filter((track) => track.id !== id),
      }));
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  },

  setTracks: (tracks) => set({ tracks }),
  setLoading: (loading) => set({ loading }),

}));


export const useTrackFilters = create<FiltersState>((set) => ({
  page: 1,
  limit: 9,
  sort: 'title',
  order: 'asc',
  search: '',
  genre: '',
  artist: '',
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () =>
    set({
      page: 1,
      limit: 9,
      sort: 'title',
      order: 'asc',
      search: '',
      genre: '',
      artist: '',
    }),
}));
