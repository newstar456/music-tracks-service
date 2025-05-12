'use client';

import { useEffect, useState } from 'react';
import { useTrackStore, useTrackFilters } from '@/lib/stores/useTracksStore';
import CreateModal from '@/components/CreateModal';
import EditModal from '@/components/EditModal';
import Loader from '@/components/Loader';
import {Track} from '@/types'
import TrackCard from '@/components/TrackCard';
import UploadAudioModal from '@/components/UploadAudioModal';
import { useDebouncedCallback } from 'use-debounce';


export default function TracksPage() {

  const { tracks, fetchTracks, loading } = useTrackStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [trackToUploadAudio, setTrackToUploadAudio] = useState<Track | null>(null);
  const [highlightedTrackId, setHighlightedTrackId] = useState<number | null>(null);
  const { setFilters, resetFilters, ...filters } = useTrackFilters();
  const [inputValues, setInputValues] = useState({
    search: filters.search,
    genre: filters.genre,
    artist: filters.artist,
  });

  const debouncedFetchTracks = useDebouncedCallback(() => {
    setFilters({ ...inputValues });
    fetchTracks({ ...filters, ...inputValues });
  }, 500);

  useEffect(() => {
    fetchTracks({ ...filters });
  }, [filters.sort, filters.order, filters.page]);

  const openEdit = (track: Track) => {
    setTrackToEdit(track);
    setEditModalOpen(true);
  };

  const onAudioUpload = (track: Track) => {
    setTrackToUploadAudio(track);
    setAudioModalOpen(true);
  };

  const handleTrackHighlight = (id: number) => {
    setHighlightedTrackId(id);
    setTimeout(() => setHighlightedTrackId(null), 2000);
  };


  const handleInputChange = (field: keyof typeof inputValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValues((prev) => ({ ...prev, [field]: value }));
    debouncedFetchTracks();       
  };

  const handleSelectChange = (field: 'sort' | 'order') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ [field]: e.target.value });
    fetchTracks({ ...filters, [field]: e.target.value });
  };

  if (loading) return <Loader/>;

  return (
    <div className="p-6 mx-0">

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Track
        </button>
        <CreateModal
          isOpen={createModalOpen}
          onRequestClose={() => setCreateModalOpen(false)} 
        />
        <EditModal
          isOpen={editModalOpen}
          onRequestClose={() => setEditModalOpen(false)}
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
            setAudioModalOpen(false);
            setTrackToUploadAudio(null);
            if (trackToUploadAudio?.id) {
              handleTrackHighlight(trackToUploadAudio.id);
            }
          }}
        />
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-sm font-medium mr-2">Sort by:</label>
          <select
            value={filters.sort}
            onChange={handleSelectChange('sort')}
            className="border rounded p-1"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="createdAt">Created At</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mr-2">Order:</label>
          <select
            value={filters.order}
            onChange={handleSelectChange('order')}
            className="border rounded p-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Genre"
            value={inputValues.genre}
            onChange={handleInputChange('genre')}
            className="border rounded p-1"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Artist"
            value={inputValues.artist}
            onChange={handleInputChange('artist')}
            className="border rounded p-1"
          />
        </div>

        <button
          onClick={resetFilters}
          className="text-xs hover:cursor-pointer text-white px-4 py-2 rounded bg-blue-500 font-semibold"
        >
            Reset Filters
        </button>

        <div>
          <input
            type="text"
            placeholder="Search..."
            value={inputValues.search}
            onChange={handleInputChange('search')}
            className="border rounded p-1"
          />
        </div>
      </div>

      <ul>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} onEdit={openEdit} onAudioUpload={onAudioUpload} isHighlighted={highlightedTrackId === track.id}/>
          ))}
        </div>
      </ul>
    </div>
  );
}
