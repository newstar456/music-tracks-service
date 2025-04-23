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
export interface EditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onTrackUpdated: () => void;
  track: Track | null;
}

export interface CreateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onTrackCreated: () => void;
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
  onUploadSuccess: (updatedTrack:Track) => void;
}