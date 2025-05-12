 export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  genres: string[];
  slug?:string,
  audioFile?: string;
}

export type TrackCardProps = {
  track: Track;
  onEdit: (track: Track) => void;
  onAudioUpload: (track: Track) => void;
  isHighlighted?: boolean;
};
export interface EditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  track: Track | null;
}
export interface CreateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}
export interface TrackForm {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  genres: string[];
}
export interface AudioUploadProps {
  isOpen: boolean;
  onRequestClose: () => void;
  track: Track | null;
  onUploadSuccess: () => void;
}

export type TrackStore = {
  tracks: Track[];
  loading: boolean;
  fetchTracks: (filters?: TrackFilters) => Promise<void>;
  deleteTrack: (id: number) => Promise<void>;
  setTracks: (tracks: Track[]) => void;
  setLoading: (loading: boolean) => void;
};

export type SortField = 'title' | 'artist' | 'album' | 'createdAt';
export interface FiltersState {
  page: number;
  limit: number;
  sort: SortField;
  order: 'asc' | 'desc';
  search: string;
  genre: string;
  artist: string;
  setFilters: (filters: Partial<FiltersState>) => void;
  resetFilters: () => void;
}

export type TrackFilters = {
  page?: number;
  limit?: number;
  sort?: 'title' | 'artist' | 'album' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
};