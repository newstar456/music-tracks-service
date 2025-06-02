'use client';

import { useEffect, useState } from 'react';
import { useTrackStore, useTrackFilters } from '@/lib/stores/useTracksStore';
import CreateModal from '@/components/CreateModal';
import EditModal from '@/components/EditModal';
// import Loader from '@/components/Loader';
import {Track} from '@/types'
import TrackCard from '@/components/TrackCard';
import UploadAudioModal from '@/components/UploadAudioModal';
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon } from 'lucide-react';
import Pagination from '@/components/Pagination';


export default function TracksPage() {

  const [selectedTrackIds, setSelectedTrackIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [trackToUploadAudio, setTrackToUploadAudio] = useState<Track | null>(null);
  const [highlightedTrackId, setHighlightedTrackId] = useState<number | null>(null);
  const { tracks, fetchTracks, totalPages, deleteTracks } = useTrackStore();
  const { setFilters, resetFilters, setPage, ...filters } = useTrackFilters();

  useEffect(() => {
    fetchTracks(filters);
  }, [filters.page]);

  const debouncedFetchTracks = useDebouncedCallback((updatedFilters) => {
    fetchTracks(updatedFilters);
  }, 1000);

  const handleInputChange = (field: 'genre' | 'artist' | 'search') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const capitalizedValue = rawValue.charAt(0).toUpperCase() + rawValue.slice(1).toLowerCase();
    let newFilters;
    if(field === 'genre'){
      newFilters = { ...filters, [field]: capitalizedValue };
    } else {
      newFilters = { ...filters, [field]: rawValue };
    }
      setFilters(newFilters);
      debouncedFetchTracks(newFilters);
  };

  const handleSelectChange = (field: 'sort' | 'order') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, [field]: e.target.value };
    debouncedFetchTracks(newFilters);
  };

  const handleDeleteTracks = async () => {
    setDeleting(true);
    try {
      const failed = await deleteTracks(selectedTrackIds);
      if (failed.length) {
        alert(`Failed to delete ${failed.length} tracks.`);
      }
      setSelectedTrackIds([]);
      fetchTracks();
    } catch (err) {
      console.error(err);
      alert('Error deleting tracks.');
    } finally {
      setDeleting(false);
    }
  };

  const resetAllFilters = () => {
    resetFilters();
    fetchTracks({ page: 1, limit: 9, sort: 'title', order: 'asc', search: '', genre: '', artist: '' });
  };

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

  return (
    <div className="p-6 mx-0">

      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => setCreateModalOpen(true)} >
        CREATE TRACK
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
      <div className="mb-6 flex flex-col items-end gap-6">
        <div className='flex flex-row gap-10'>
          <div>
            <label className="text-sm font-medium mr-2">sort by:</label>
            <select value={filters.sort} onChange={handleSelectChange('sort')} className="border rounded p-1" >
              <option value="title">title</option>
              <option value="artist">artist</option>
              <option value="album">album</option>
              <option value="createdAt">created At</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mr-2">order:</label>
            <select value={filters.order} onChange={handleSelectChange('order')} className="border rounded p-1" >
              <option value="asc">ascending</option>
              <option value="desc">descending</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-8 mb-6">
          <input type="text" placeholder="genre" value={filters.genre} onChange={handleInputChange('genre')} className="border rounded p-1"/>
          <input type="text" placeholder="artist" value={filters.artist} onChange={handleInputChange('artist')} className="border rounded p-1"/>
          <div className='relative'>
            <SearchIcon size={16} className='absolute left-[8px] top-[8px]'/>
            <input type="search" placeholder="search.." value={filters.search} onChange={handleInputChange('search')} className="border pl-[32px] rounded p-1"/>
          </div>
          
          <button onClick={resetAllFilters}>RESET</button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setSelectedTrackIds(tracks.map((track) => track.id))} className="bg-gray-300 px-3 py-1 rounded text-sm" >
          select all
        </button>
        <button onClick={() => setSelectedTrackIds([])} className="bg-gray-300 px-3 py-1 rounded text-sm" >
          clear selection
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded text-sm"
          onClick={handleDeleteTracks}
          disabled={deleting}
          >
          {deleting
          ? 'deleting...'
          : `delete selected (${selectedTrackIds.length})`}
        </button>
      </div>

      <ul>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-[306px]">
          {tracks.map((track) => (
            <div key={track.id} className="relative">
              <input
                type="checkbox"
                className="absolute bottom-8 right-8 z-10"
                checked={selectedTrackIds.includes(track.id)}
                onChange={(e) => {
                  setSelectedTrackIds((prev) =>
                    e.target.checked
                      ? [...prev, track.id]
                      : prev.filter((id) => id !== track.id)
                  );
                }}
              />
              <TrackCard
                track={track}
                onEdit={openEdit}
                onAudioUpload={onAudioUpload}
                isHighlighted={highlightedTrackId === track.id}
              />
            </div>
          ))}
        </div>
      </ul>

      <Pagination totalPages={totalPages} currentPage={filters.page} onPageChange={setPage} />

    </div>
  );
}
