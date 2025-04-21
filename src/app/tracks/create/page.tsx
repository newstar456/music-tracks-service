'use client';

import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CreateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onTrackCreated: () => void;
}
interface TrackForm {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  genres: string[];
}
// interface Genre {
//   id: number;
//   name: string;
// }

const isValidImageUrl = (url: string): boolean => { 
  return /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};

const CreateModal = ({isOpen, onRequestClose, onTrackCreated}:CreateModalProps) => {

    const [genres, setGenres] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [form, setForm] = useState<TrackForm>({
        title: '',
        artist: '',
        album: '',
        coverImage: '',
        genres: []
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    // const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    //     setSelectedGenres(selected);
    // };
    const [error, setError] = useState('');

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
        setForm((prev) => ({ ...prev, genres: selectedGenres }));
    }, [selectedGenres]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
      e.preventDefault();

    if (!form.title || !form.artist || selectedGenres.length === 0) {
      setError('Please fill all required fields and select at least one genre.');
      return;
    }
    if (!isValidImageUrl(form.coverImage)) {
        setError('Please provide a valid image URL.');
        return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      artist: formData.get('artist'),
      album: formData.get('album'),
      cover: formData.get('cover-image'),
      genres: selectedGenres,
    };

    try {
        await api.post('/tracks', payload);
        setForm({ title: '', artist: '', album: '', coverImage: '', genres: [] });
        setError('');
        if (onTrackCreated) onTrackCreated();
        if (onRequestClose) onRequestClose();
    } catch (err) {
      console.error('Error creating track:', err);
      setError('Failed to create track.');
    }
    };

  return (
    <Modal
        isOpen={isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={onRequestClose}
        className="bg-white p-6 rounded-md shadow-lg max-w-xl mx-auto mt-20"
        ariaHideApp={false}
        // style={customStyles}
        // contentLabel="Example Modal"
      >

      <form className="min-w-[450px]" onSubmit={handleSubmit} data-testid="track-form">
        <div className="mb-6">
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input type="text" name="title" className="border border-inherit rounded-sm w-full" data-testid="input-title" value={form.title} onChange={handleChange}/>
        </div>
        <div className="mb-6">
            <label htmlFor="artist" className="block mb-2">
              Artist
            </label>
            <input type="text" name="artist" className="border border-inherit rounded-sm w-full" data-testid="input-artist" value={form.artist} onChange={handleChange}/>
        </div>
        <div className="mb-6">
            <label htmlFor="album" className="block mb-2">
              Album
            </label>
            <input type="text" name="album" className="border border-inherit rounded-sm w-full" data-testid="input-album" value={form.album} onChange={handleChange}/>
        </div>
        <div className="mb-6">
            <label htmlFor="coverImage" className="block mb-2 font-medium"> Cover Image URL: </label>
            <input type="text" name="coverImage" className={`border rounded-sm w-full px-3 py-2 transition-all duration-200 ${error && !form.coverImage ? 'border-red-500' : 'border-gray-300' }`} data-testid="input-cover-image" value={form.coverImage} onChange={handleChange} placeholder='/assets/images/music.jpg'/>
            <div className="mt-4 flex justify-center">
                <Image 
                    src={ form.coverImage && isValidImageUrl(form.coverImage) ? form.coverImage  : "/assets/images/music.jpg" }
                    width={300}
                    height={250}
                    alt="Cover Preview"
                    className="h-40 w-auto object-cover rounded shadow-sm border"
                />
            </div>
            {error && !isValidImageUrl(form.coverImage) && ( <p className="text-red-500 text-sm mt-1">Please enter a valid image URL.</p> )}
        </div>
        <div className="mb-6">
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

            <div className={`flex flex-wrap gap-2 p-3 border rounded-md transition-all duration-300 ${
                error && selectedGenres.length === 0
                ? 'border-red-500'
                : 'border-gray-300'
             }`}
            >
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
            {error && selectedGenres.length === 0 && (
              <p className="text-red-500 text-sm mt-1">Please select at least one genre.</p>
            )}
        </div>
       
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" data-testid="submit-button">Submit</button>
        </div>
      </form>

      </Modal>
  )
}

export default CreateModal