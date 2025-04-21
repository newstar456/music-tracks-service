'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CreateModal from './create/page';
import Loader from '../loader/Loader';

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

console.log(tracks);
  if (loading) return <Loader/>;

  return (
    <div>
        <h1 data-testid="tracks-header" className="text-3xl font-bold mb-4">Track List</h1>

        <button
            data-testid="create-track-button"
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            onClick={() => setShowModal(true)}
            >
            Create Track
        </button>
        <CreateModal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)} 
            onTrackCreated={()=> {
                fetchTracks();
                setShowModal(false);
            }} />


      <ul>
        {tracks.map(track => (
          <li key={track.id} data-testid={`track-item-${track.id}` } className="mb-3 px-4 py-2  bg-amber-100 rounded-md hover:bg-amber-200 hover:cursor-pointer">
          <div className='flex flex-row justify-between mb-2'>
            <strong data-testid={`track-item-${track.id}-title`} className='text-lg'>{track.title}</strong> 
            <span data-testid={`track-item-${track.id}-artist`}><span className='text-sm'>by{' '}</span> {track.artist}</span>
          </div>

            <ul>
                {track.genres.map((genre) => (
                  <button key={genre} value={genre} className='bg-violet-500 focus:outline-none focus:ring text-white px-3 py-1 rounded-md mr-1 hover:cursor-pointer font-bold'>{genre}</button>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
