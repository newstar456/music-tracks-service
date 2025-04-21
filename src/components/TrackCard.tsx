import { Pencil, Upload } from 'lucide-react';
import Image from 'next/image';
import {Track} from '../types';
import api from '@/lib/api';

const TrackCard = ({ track, onEdit, onAudioUpload, onUploadSuccess }: { track: Track; onEdit: (track: Track) => void; onAudioUpload: (track: Track) => void; onUploadSuccess: () => void }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm relative group hover:shadow-md transition">
      <Image
        width={300}
        height={200}
        src={'/assets/images/music.jpg'}
        // src={track.coverImage || '/assets/images/music.jpg'}
        alt={track.title}
        unoptimized
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <div className="font-bold text-lg">{track.title}</div>
      <div className="text-gray-600 text-sm">{track.artist}</div>
      <div className="text-xs mt-1 text-gray-400">{track.album}</div>

    {track.audioFile && (
        <div className="mt-4">
            <audio controls className="w-full">
            <source src={track.audioFile} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <button
                onClick={async () => {
                    const updated = { ...track, audioFile: '' };
                    await api.delete(`/tracks/${track.id}/file`, updated);
                    // onUploadSuccess();
                }}
                className="text-sm text-red-500 mt-2 hover:underline"
            >
            Remove audio
            </button>
        </div>
    )}
      

      <button
        onClick={() => onEdit(track)}
        className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 bg-white border rounded-full p-1 shadow transition"
        title="Edit Track"
      >
        <Pencil size={16} />
      </button>
      <button
          onClick={() => onAudioUpload(track)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white border rounded-full p-1 shadow transition"
          title="Upload Audio"
      > 
        <Upload size={16} />
      </button>
    </div>
  );
};

export default TrackCard;
