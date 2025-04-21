'use client';

import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { X } from 'lucide-react';
import Image from 'next/image';
import {Track, EditModalProps} from '../types'


const isValidImageUrl = (url: string): boolean => { 
    // console.log(url);
  if(url == '/assets/images/music.jpg'){
    return true;
  } else return /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};

const EditModal = ({ isOpen, onRequestClose, onTrackUpdated, track }: EditModalProps) => {
  const [form, setForm] = useState<Track | null>(null);
  const [genres, setGenres] = useState<string[] | []>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !track) return;
    setForm({ ...track });
  }, [isOpen, track]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchGenres = async () => {
      try {
        const res = await api.get('/genres');
        setGenres(res.data);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };
    fetchGenres();
  }, [isOpen]);
  useEffect(() => {
    setForm((prev) => prev ? { ...prev, genres: selectedGenres } : null);
  }, [selectedGenres]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (form) setForm(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.title || !form.artist || form.genres.length === 0) {
      setError('Please fill all required fields and select at least one genre.');
      return;
    }
    if (!isValidImageUrl(form.coverImage)) {
      setError('Please provide a valid image URL.');
      return;
    }

    try {
      await api.put(`/tracks/${form.id}`, form);
      onTrackUpdated();
      onRequestClose();
    } catch (err) {
      console.error('Error updating track:', err);
      setError('Failed to update track.');
    }
  };

  if (!form) return null;
console.log(form.coverImage);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded-md shadow-lg max-w-xl mx-auto mt-20"
      ariaHideApp={false}
    >
      <h2 className="text-xl font-semibold mb-4">Edit Track</h2>

      <form onSubmit={handleSubmit} className="min-w-[450px]">
        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input name="title" type="text" value={form.title} onChange={handleChange} className="border rounded-sm w-full px-3 py-2" />
        </div>

        {/* Artist */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Artist</label>
          <input name="artist" type="text" value={form.artist} onChange={handleChange} className="border rounded-sm w-full px-3 py-2" />
        </div>

        {/* Album */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Album</label>
          <input name="album" type="text" value={form.album} onChange={handleChange} className="border rounded-sm w-full px-3 py-2" />
        </div>

        {/* Cover */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Cover Image URL</label>
          <input
            name="coverImage"
            type="text"
            value='/assets/images/music.jpg'
            onChange={handleChange}
            className={`border rounded-sm w-full px-3 py-2 ${!isValidImageUrl(form.coverImage) ? 'border-red-500' : ''}`}
            // placeholder='/assets/images/music.jpg'
          />
          <div className="mt-4 flex justify-center">
            <Image
              src={isValidImageUrl(form.coverImage) ? form.coverImage : '/assets/images/music.jpg'}
              width={300}
              height={250}
              alt="Cover Preview"
              unoptimized
              className="h-40 w-auto object-cover rounded shadow-sm border"
            />
          </div>
          {error && !isValidImageUrl(form.coverImage) && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Genres */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Choose genres:</label>
            {selectedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4" data-testid="selected-genres">
                {selectedGenres.map((genre) => (
                  <div
                    key={`selected-${genre}`}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex flex-row items-center justify-between gap-1"
                  >
                    <div>{genre}</div>
                    <button type="button" onClick={() => setSelectedGenres((prev) => prev.filter((g) => g !== genre))} className="hover:text-red-600 transition-colors font-bold hover:font-extrabold block hover:cursor-pointer" aria-label={`Remove ${genre}`}>
                        <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* <div className={`flex flex-wrap gap-2 p-3 border rounded-md transition-all duration-300 ${
                error && selectedGenres.length === 0
                ? 'border-red-500'
                : 'border-gray-300'
             }`}/> */}
            <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                  {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() =>
                          setSelectedGenres((prev) =>
                            isSelected
                              ? prev.filter((g) => g !== genre)
                              : [...prev, genre]
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm hover:cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 scale-105'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                        }`}
                        data-testid={`genre-pill-${genre}`}
                      >
                        {isSelected ? '' : ' + '}{genre}
                      </button>
                    );
                  })}
            </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditModal;
