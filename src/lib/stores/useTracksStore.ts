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
  createTrack: async (newTrack: Partial<Track>) => {
  const prevTracks = get().tracks;

  const tempId = Date.now();

  const optimisticTrack = { ...newTrack, id: tempId } as Track;
  set((state) => ({ tracks: [optimisticTrack, ...state.tracks] }));

  try {
    const res = await api.post('/tracks', newTrack);
    const createdTrack = res.data.data;

    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === tempId ? createdTrack : track
      ),
    }));
  } catch (err) {
    console.error('Error creating track:', err);
    set({ tracks: prevTracks });
  }
},
  editTrack: async (id: number, updates: Partial<Track>) => { 
    const prevTracks = get().tracks;
    const updatedTracks = prevTracks.map((track) =>
      track.id === id ? { ...track, ...updates } : track
    );
    set({ tracks: updatedTracks });
    try {
      const res = await api.put(`/tracks/${id}`, updates);
      const updatedTrack = res.data.data;
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === id ? updatedTrack : track
        ),
      }));
    } catch (err) {
      console.error('Error updating track:', err);
      set({ tracks: prevTracks });
    }
  },

  deleteTrack: async (id: number) => {
    const prevTracks = get().tracks;

    set((state) => ({
      tracks: state.tracks.filter((track) => track.id !== id),
    }));

    try {
      await api.delete(`/tracks/${id}`);
    } catch (err) {
      console.error('Error deleting track:', err);
      set({ tracks: prevTracks });
    }
  },
  deleteTracks: async (ids: number[]) => {
    const prevTracks = get().tracks;
    const remainingTracks = prevTracks.filter((track) => !ids.includes(track.id));

    set({ tracks: remainingTracks });

    const failedIds: number[] = [];

    for (const id of ids) {
      try {
        await api.delete(`/tracks/${id}`);
      } catch (err) {
        console.error(`Failed to delete track ${id}`, err);
        failedIds.push(id);
      }
    }

    if (failedIds.length > 0) {
      const restoredTracks = prevTracks.filter((track) => failedIds.includes(track.id));
      set((state) => ({
        tracks: [...state.tracks, ...restoredTracks],
      }));
    }

    return failedIds;
  },

  setTotalPages: (pages: number) => set({ totalPages: pages }),
  setTracks: (tracks) => set({ tracks }),
  setLoading: (loading) => set({ loading }),

}));


export const useTrackFilters = create<FiltersState>((set) => ({
  page: 1,
  limit: 10,
  sort: 'title',
  order: 'asc',
  search: '',
  genre: '',
  artist: '',
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  setSearch: (search: string) => set((state) => ({ ...state, search })),
  resetFilters: () =>
    set({
      page: 1,
      limit: 10,
      sort: 'title',
      order: 'asc',
      search: '',
      genre: '',
      artist: '',
    }),
  setPage: (page: number) => set((state) => ({ ...state, page })),
}));
