import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useAppDispatch } from '../redux/hooks'; // Import Redux dispatch hook
import { addVideo, updateVideo } from '../redux/slices/videosSlice'; // Import actions

interface Video {
  videoId: string;
  title: string;
  description: string;
  url: string;
  categoryId: number;
  likes: string[];
  dislikes: string[];
  uploadDate: string;
  views: number;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo?: Video | null;
  onVideoUpload?: (video: Video) => void;
  onVideoUpdate?: (video: Video) => void;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  selectedVideo,
  onVideoUpload,
  onVideoUpdate,
}) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    videoId: '',
    title: '',
    description: '',
    url: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVideo) {
      setForm({
        videoId: selectedVideo.videoId,
        title: selectedVideo.title,
        description: selectedVideo.description,
        url: selectedVideo.url,
        categoryId: selectedVideo.categoryId.toString(),
      });
    } else {
      setForm({ videoId: '', title: '', description: '', url: '', categoryId: '' });
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          if (!token) throw new Error('Admin token not found. Please log in again.');

          const response = await fetch('https://mini-youtube-fdhn.onrender.com/api/admin/categories', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch categories');
          }

          const data = await response.json();
          setCategories(data);
          if (data.length === 0) {
            setError('No categories found. Please add categories first.');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load categories. Please try again.');
        }
      };

      fetchCategories();
    }
  }, [isOpen]);

  const extractVideoId = (url: string): string => {
    try {
      const urlObj = new URL(url);
      let videoId = '';
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.split('/')[1] || '';
      }
      if (!videoId || videoId.length !== 11) {
        throw new Error('Invalid YouTube URL');
      }
      return videoId;
    } catch {
      throw new Error('Invalid YouTube URL');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'url') {
      try {
        const videoId = extractVideoId(value);
        setForm((prev) => ({ ...prev, videoId, url: `https://www.youtube.com/embed/${videoId}` }));
        setError(null);
      } catch (err: any) {
        setForm((prev) => ({ ...prev, videoId: '', url: value }));
        setError(err.message);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      if (!form.url) throw new Error('Please enter a YouTube URL');
      if (!form.videoId) throw new Error('Invalid YouTube URL');

      const selectedCategory = categories.find(cat => cat.categoryId.toString() === form.categoryId);
      if (!selectedCategory) throw new Error('Please select a valid category');

      const payload = {
        videoId: form.videoId,
        title: form.title,
        description: form.description,
        url: form.url,
        categoryId: selectedCategory.categoryId,
      };

      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Admin token not found. Please log in again.');

      const method = selectedVideo ? 'PUT' : 'POST';
      const url = selectedVideo
        ? `https://mini-youtube-fdhn.onrender.com/api/admin/videos/${selectedVideo.videoId}`
        : 'https://mini-youtube-fdhn.onrender.com/api/admin/videos';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${selectedVideo ? 'update' : 'upload'} video`);
      }

      const responseData = await response.json();

      const videoData = {
        _id: responseData._id || `temp-${form.videoId}`, 
        videoId: payload.videoId,
        title: payload.title,
        description: payload.description,
        url: payload.url,
        categoryId: payload.categoryId,
        likes: responseData.likes || [],
        dislikes: responseData.dislikes || [],
        uploadDate: responseData.uploadDate || new Date().toISOString(),
        views: responseData.views || 0,
        createdAt: responseData.createdAt || new Date().toISOString(),
        updatedAt: responseData.updatedAt || new Date().toISOString(),
      };

      if (selectedVideo) {
        dispatch(updateVideo(videoData)); 
        onVideoUpdate?.(videoData); 
      } else {
        dispatch(addVideo(videoData)); 
        onVideoUpload?.(videoData); 
      }

      setSuccess(`Video ${selectedVideo ? 'updated' : 'uploaded'} successfully!`);
      setTimeout(() => {
        setSubmitting(false);
        setSuccess(null);
        setForm({ videoId: '', title: '', description: '', url: '', categoryId: '' });
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || `Failed to ${selectedVideo ? 'update' : 'upload'} video. Please try again.`);
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-2xl text-white p-6"
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <X size={22} />
              </button>

              <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
                <Upload size={22} />
                {selectedVideo ? 'Edit Video' : 'Upload Video'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  name="title"
                  placeholder="Enter video title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-700 px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <textarea
                  name="description"
                  placeholder="Write a description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md bg-gray-700 px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="url"
                  placeholder="Paste YouTube URL"
                  value={form.url}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-700 px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-700 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId.toString()}
                      >
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
                </select>

                {success && <p className="text-sm text-green-400">{success}</p>}
                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  disabled={submitting}
                  className="w-full rounded-md bg-blue-600 py-2 font-medium hover:bg-blue-700 disabled:bg-blue-600/60"
                >
                  {submitting ? (selectedVideo ? 'Updating...' : 'Uploading...') : (selectedVideo ? 'Update' : 'Upload')}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;