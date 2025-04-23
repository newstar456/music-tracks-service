'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CreateModal from '../../components/CreateModal';
import EditModal from '../../components/EditModal';
import Loader from '../../components/Loader';
import {Track} from '../../types'
import TrackCard from '../../components/TrackCard';
import UploadAudioModal from '@/components/UploadAudioModal';


export default function TracksPage() {

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [trackToUploadAudio, setTrackToUploadAudio] = useState<Track | null>(null);

  const fetchTracks = () => {
    setLoading(true);
    api.get('/tracks')
      .then(res => setTracks(res.data.data))
      .catch(err => console.error('Error fetching tracks:', err))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    fetchTracks();
  }, []);

  const openEdit = (track: Track) => {
    setTrackToEdit(track);
    setEditModalOpen(true);
  };

  const onAudioUpload = (track: Track) => {
    setTrackToUploadAudio(track);
    setAudioModalOpen(true);
  };

  const handleUploadSuccess = (updatedTrack:Track) => {
    setTracks((prev) => prev.map(track => (track.id === updatedTrack.id ? updatedTrack : track)));
  };


  if (loading) return <Loader/>;
//   console.log(tracks);

  return (
    <div className="p-6 mx-0">
        <h1 data-testid="tracks-header" className="text-3xl font-bold mb-4">Tracks List</h1>

        <button
            data-testid="create-track-button"
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            onClick={() => setCreateModalOpen(true)}
            >
            Create Track
        </button>
        <CreateModal
            isOpen={createModalOpen}
            onRequestClose={() => setCreateModalOpen(false)} 
            onTrackCreated={()=> {
                fetchTracks();
                setCreateModalOpen(false);
            }}
        />
        <EditModal
            isOpen={editModalOpen}
            onRequestClose={() => setEditModalOpen(false)}
            onTrackUpdated={fetchTracks}
            track={trackToEdit}
        />
        <UploadAudioModal
            isOpen={audioModalOpen}
            onRequestClose={() => {
              setAudioModalOpen(false);
              setTrackToUploadAudio(null);
            }}
            track={trackToUploadAudio}
            onUploadSuccess={(updatedTrack) => {
              handleUploadSuccess(updatedTrack);
              setAudioModalOpen(false);
              setTrackToUploadAudio(null);
            }}
        />

      <ul>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="tracks-header">
                {tracks.map((track) => (
                    <TrackCard key={track.id} track={track} onEdit={openEdit} onAudioUpload={onAudioUpload} />
                ))}
            </div>
      </ul>
    </div>
  );
}
