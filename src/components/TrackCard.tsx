import { Pencil, Upload, Trash } from 'lucide-react';
import Image from 'next/image';
import {TrackCardProps} from '../types';
import api from '@/lib/api';
import { useTrackStore } from '@/lib/stores/useTracksStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';


const TrackCard = ({ track, onEdit, onAudioUpload, isHighlighted }: TrackCardProps) => {

  const API_BASE_URL = 'http://localhost:8000';
  const audioUrl = `${API_BASE_URL}/api/files/${track.audioFile}`;
  const { fetchTracks } = useTrackStore();
  const deleteTrack = useTrackStore((state) => state.deleteTrack);

  const handleAudioRemove = async () => {
    try {
      await api.delete(`/tracks/${track.id}/file`);
      await fetchTracks(); 
    } catch (err) {
      console.error('Failed to delete audio file:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrack(track.id);
      toast.success('Track deleted successfully!');
    } catch {
      toast.error('Failed to delete track.');
    }
  };

  return (
    <div className={clsx("border rounded-lg p-4 shadow-sm relative group hover:shadow-md transition h-full w-full", isHighlighted ? 'border-green-500 bg-green-50' : '')} >
      <Image
        width={300}
        height={200}
        src={'/assets/images/music.jpg'}
        alt={track.title}
        unoptimized
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <div className="font-bold text-lg">{track.title}</div>
      <div className="text-gray-600 text-sm">{track.artist}</div>
      <div className="text-xs mt-1 text-gray-400">{track.album}</div>

    {track.audioFile && (
        <div className="mt-4">
          <audio controls src={`${audioUrl}`} className="w-full"  />

          <button
            onClick={handleAudioRemove}
            className="text-sm text-red-500 mt-2 hover:underline"
          >
            Remove audio
          </button>
        </div>
    )}

      <button
        onClick={() => onEdit(track)}
        className="absolute top-2 right-18 opacity-0 group-hover:opacity-100 bg-white border rounded-full p-1 shadow transition"
        title="Edit Track"
      >
        <Pencil size={16} />
      </button>
      <button
          onClick={() => onAudioUpload(track)}
          className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 bg-white border rounded-full p-1 shadow transition"
          title="Upload Audio"
      > 
        <Upload size={16} />
      </button>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white border rounded-full p-1 shadow transition"
        title="Delete Track"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};

export default TrackCard;
