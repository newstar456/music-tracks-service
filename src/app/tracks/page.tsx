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

  const [tracks, setTracks] = useState([]);
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

  if (loading) return <Loader/>;
  console.log(tracks);

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
            onUploadSuccess={() => {
              fetchTracks();
              setAudioModalOpen(false);
              setTrackToUploadAudio(null);
            }}
        />

      <ul>
        {/* {tracks.map(track => (
          <li key={track.id} data-testid={`track-item-${track.id}` } className="mb-3 px-6 py-8  bg-amber-100 rounded-md hover:bg-amber-200 ">
          <div className='flex flex-row justify-between mb-4'>
            <strong data-testid={`track-item-${track.id}-title`} className='text-lg'>{track.title}</strong> 
            <span data-testid={`track-item-${track.album}-album`}>Album:{track.album}</span>
            <span data-testid={`track-item-${track.id}-artist`}><span className='text-sm'>by{' '}</span> {track.artist}</span>
          </div>
          <div className='flex flex-row justify-between items-center'>
            <ul>
              {track.genres.map((genre) => (
                <button key={genre} value={genre} className='bg-violet-500 focus:outline-none focus:ring text-white px-3 py-1 rounded-md mr-1 font-bold'>{genre}</button>
              ))}
            </ul>
            <button onClick={() => openEdit(track)} className='bg-amber-700 focus:outline-none focus:ring text-white px-3 py-1 rounded-md mr-1 hover:cursor-pointer font-bold'>Edit</button>
          </div>

          </li>
        ))} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracks.map((track) => (
                    <TrackCard key={track.id} track={track} onEdit={openEdit} onAudioUpload={onAudioUpload} onUploadSuccess={fetchTracks}/>
                ))}
            </div>
      </ul>
    </div>
  );
}
