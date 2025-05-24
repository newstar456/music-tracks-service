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
import { SearchIcon } from 'lucide-react';


export default function TracksPage() {

  const { tracks, fetchTracks, loading, totalPages } = useTrackStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [trackToUploadAudio, setTrackToUploadAudio] = useState<Track | null>(null);
  const [highlightedTrackId, setHighlightedTrackId] = useState<number | null>(null);
  const { setFilters, resetFilters, setPage, ...filters } = useTrackFilters();
  const [inputValues, setInputValues] = useState({
    search: filters.search,
    genre: filters.genre,
    artist: filters.artist,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
// console.log(filters);

  const debouncedFetchTracks = useDebouncedCallback(() => {
    setFilters({ ...inputValues });
    fetchTracks({ ...filters, ...inputValues });
  }, 1000);

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
          onClick={() => {
            resetFilters();
            setInputValues({
              search: '',
              genre: '',
              artist: '',
            });
            fetchTracks({ page: 1, limit: 9, sort: 'title', order: 'asc', search: '', genre: '', artist: '' });
          }}
          className="text-xs hover:cursor-pointer text-white px-4 py-2 rounded bg-blue-500 font-semibold"
        >
          Reset Filters
        </button>
        <div className='relative'>
          <SearchIcon size={16} className='absolute left-[8px] top-[8px]'/>
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              // setCurrentPage(1);
            }}
            className='py-1 pl-[32px] border'
          />
        </div>

        {/* <div>
          <input
            type="text"
            placeholder="Search..."
            value={inputValues.search}
            onChange={handleInputChange('search')}
            className="border rounded p-1"
          />
        </div> */}

      </div>
      {tracks.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() =>
              setSelectedTrackIds(tracks.map((track) => track.id))
            }
            className="bg-gray-300 px-3 py-1 rounded text-sm"
          >
            Select All
          </button>

          <button
            onClick={() => setSelectedTrackIds([])}
            className="bg-gray-300 px-3 py-1 rounded text-sm"
          >
            Clear Selection
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded mb-4"
            onClick={async () => {
              setDeleting(true);
              try {
                const failed = await useTrackStore.getState().deleteTracks(selectedTrackIds);
                if (failed.length > 0) {
                  alert(`Failed to delete ${failed.length} tracks.`);
                }
                setSelectedTrackIds([]);
              } catch (err) {
                console.error(err);
                alert('An error occurred while deleting tracks.');
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
            >
            {deleting
            ? 'Deleting...'
            : `Delete Selected (${selectedTrackIds.length})`}
          </button>
        </div>
      )}
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

      <div className="mt-8 flex justify-center gap-4">
        <button
          disabled={filters.page === 1}
          onClick={() => setPage(filters.page - 1)}
          className={`px-4 py-2 rounded ${filters.page === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>

        <span className="px-4 py-2">Page {filters.page}</span>

        <button
          disabled={filters.page >= totalPages}
          onClick={() => setPage(filters.page + 1)}
          className={`px-4 py-2 rounded ${filters.page >= totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>

    </div>
  );
}
