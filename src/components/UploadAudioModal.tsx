'use client';

import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Upload } from 'lucide-react';
import {AudioUploadProps} from '../types'

const MAX_FILE_SIZE_MB = 10;

const UploadAudioModal = ({ isOpen, onRequestClose, track }: AudioUploadProps) => {

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
  if (!track) {
    setError('No track selected.');
  } else {
    setError('');
  }
  }, [track]);

  if (!track) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = ['audio/mpeg', 'audio/wav'];
    if (!validTypes.includes(selected.type)) {
      setError('Only MP3 or WAV files are allowed.');
      return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setError('');
    setFile(selected);
    // console.log(selected);
  };

  const handleUpload = async () => {
    if (!file || !track) {
      setError('Please select a file first.');
      return;
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('id', track.id.toString());
      formData.append('title', track.title);
      formData.append('artist', track.artist);
      formData.append('album', track.album);
      formData.append('genres', JSON.stringify(track.genres));
      formData.append('slug', track.slug || '');
      formData.append('coverImage', track.coverImage || '');
      formData.append('audioFile', file);

      await api.post(`/tracks/${track.id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


        onRequestClose();
    } catch (err) {
          console.error('Upload failed:', err);
          setError('Upload failed. Please try again.');
        } finally {
          setIsUploading(false);
        }
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="bg-white p-6 rounded shadow max-w-md mx-auto mt-24" ariaHideApp={false} >
      <h2 className="text-lg font-semibold mb-4">Upload Audio File</h2>

    <label htmlFor="fileInput"
    className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-sm cursor-pointer hover:bg-gray-200 transition-colors">
        <Upload size={16} />
        {file ? file.name : "Choose an audio file (.mp3 or .wav)"}
    </label>
      <input type="file" id="fileInput" name='fileInput' accept=".mp3,.wav" onChange={handleFileChange} className="hidden" data-testid={`upload-track-${track.id}`}/>
      
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex justify-end gap-2">
        <button onClick={onRequestClose} className="px-3 py-2 border rounded">Cancel</button>
        <button onClick={handleUpload} className="px-3 py-2 bg-blue-600 text-white rounded" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Upload'}</button>
      </div>
    </Modal>
  );
};

export default UploadAudioModal;
