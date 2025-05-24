import { create } from 'zustand';
import api from '@/lib/api';
import { TrackStore, FiltersState, Track } from '@/types';


export const useTrackStore = create<TrackStore>((set, get) => ({

  tracks: [],
  loading: false,
  totalPages: 1,

  fetchTracks: async (filters = {}) => {
    set({ loading: true });
    try {
      const res = await api.get('/tracks', {params: filters});
      set({ 
        tracks: res.data.data,
        totalPages: res.data.meta.totalPages,
      });
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

  deleteTracks: async (ids: number[]) => {
    const { tracks } = get();
    const failedIds: number[] = [];
  
    for (const id of ids) {
      try {
        await api.delete(`/tracks/${id}`);
      } catch (err) {
        console.error(`Failed to delete track ${id}`, err);
        failedIds.push(id);
      }
    }
  
    set({
      tracks: tracks.filter((track:Track) => !ids.includes(track.id) || failedIds.includes(track.id)),
    });
  
    return failedIds;
  },

  setTotalPages: (pages: number) => set({ totalPages: pages }),
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
  setPage: (page: number) => set((state) => ({ ...state, page })),
}));
