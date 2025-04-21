'use client';

// import { useEffect, useState } from 'react';
// import api from '@/lib/api';

// interface Track {
//   id: string;
//   title: string;
//   artist: string;
//   album?: string;
//   genres: string[];
//   coverImage?: string;
//   audioUrl?: string;
// }

export default function TrackPage() {

//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [loading, setLoading] = useState(true);

//   const res = await api.get('/tracks');
// const tracks = res.data.data;

//   const fetchTracks = async function(){
   
//     return res;
//   }

//   const tracksnew = fetchTracks()
//   console.log(tracksnew);

//   useEffect(() => {
    

//     api.get('/tracks')
//       .then(res => setTracks(res.data))
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   console.log(tracks);

  return (
    <div>
      <h1 data-testid="tracks-header" className="text-3xl font-bold mb-4">Track List</h1>

      <button data-testid="create-track-button" className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Create Track
      </button>

      {/* {loading ? (
        <div data-testid="loading-tracks" data-loading="true">Loading tracks...</div>
      ) : (
        <ul>
          {tracks.map((track) => (
            <li
              key={track.id}
              data-testid={`track-item-${track.id}`}
              className="bg-white rounded p-4 mb-4 shadow"
            >
              <div data-testid={`track-item-${track.id}-title`} className="font-semibold text-lg">
                {track.title}
              </div>
              <div data-testid={`track-item-${track.id}-artist`} className="text-gray-700">
                {track.artist}
              </div>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );

}
