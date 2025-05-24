import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, LogOut, Upload, Users, X, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ytLogo from '../assets/yt.png';
import UploadModal from '../components/UploadModal';
import AdminVideoCard from '../components/AdminVideoCard';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import RetryButton from '../components/RetryButton';

interface User {
  _id: string;
  name: string;
  email: string;
}

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

const AdminDash: React.FC = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUsersSidebarOpen, setIsUsersSidebarOpen] = useState<boolean>(false);
  const [activeMobileSection, setActiveMobileSection] = useState<string>('menu');
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState<boolean>(false);
  const [deleteVideoDialogOpen, setDeleteVideoDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [isVideosLoading, setIsVideosLoading] = useState<boolean>(false);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const [hasVideosFetchFailed, setHasVideosFetchFailed] = useState<boolean>(false);
  const [hasUsersFetchFailed, setHasUsersFetchFailed] = useState<boolean>(false);
  const [showVideosRetry, setShowVideosRetry] = useState<boolean>(false);
  const [showUsersRetry, setShowUsersRetry] = useState<boolean>(false);

  const fetchAdminName = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAdminName('Admin');
      return;
    }
    try {
      const res = await fetch('https://mini-youtube-backend-hnra.onrender.com/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch admin name');
      }
      const data = await res.json();
      setAdminName(data.name || 'Admin');
    } catch (err) {
      setAdminName('Admin');
    }
  };

  useEffect(() => {
    fetchAdminName();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setIsUsersLoading(true);
    setHasUsersFetchFailed(false);
    setShowUsersRetry(false);
    try {
      const res = await fetch('https://mini-youtube-backend-hnra.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setHasUsersFetchFailed(true);
      setTimeout(() => {
        setShowUsersRetry(true);
      }, 2000);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchVideos = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setIsVideosLoading(true);
    setHasVideosFetchFailed(false);
    setShowVideosRetry(false);
    try {
      const res = await fetch('https://mini-youtube-backend-hnra.onrender.com/api/admin/videos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await res.json();
      setVideos(data);
    } catch (err: any) {
      setHasVideosFetchFailed(true);
      setTimeout(() => {
        setShowVideosRetry(true);
      }, 2000);
    } finally {
      setIsVideosLoading(false);
    }
  };

  const addVideoToList = (newVideo: Video) => {
    setVideos((prevVideos) => [...prevVideos, newVideo]);
  };

  const updateVideoInList = (updatedVideo: Video) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.videoId === updatedVideo.videoId ? updatedVideo : video
      )
    );
  };

  useEffect(() => {
    if (isUsersSidebarOpen || activeMobileSection === 'users') {
      fetchUsers();
    }
  }, [isUsersSidebarOpen, activeMobileSection]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/');
  };

  const handleAllUsersClick = () => {
    if (window.innerWidth >= 640) {
      setIsUsersSidebarOpen(true);
    } else {
      setActiveMobileSection('users');
    }
  };

  const handleDeleteUser = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`https://mini-youtube-backend-hnra.onrender.com/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
      }
    } catch (err) {
    }
  };

  const handleEditVideo = (videoId: string) => {
    const videoToEdit = videos.find(v => v.videoId === videoId);
    if (videoToEdit) {
      setSelectedVideo(videoToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`https://mini-youtube-backend-hnra.onrender.com/api/admin/videos/${videoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setVideos(prev => prev.filter(v => v.videoId !== videoId));
      }
    } catch (err) {
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const openDeleteUserDialog = (userId: string) => {
    setUserToDelete(userId);
    setDeleteUserDialogOpen(true);
  };

  const closeDeleteUserDialog = () => {
    setDeleteUserDialogOpen(false);
    setUserToDelete(null);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
    }
    closeDeleteUserDialog();
  };

  const openDeleteVideoDialog = (videoId: string) => {
    setVideoToDelete(videoId);
    setDeleteVideoDialogOpen(true);
  };

  const closeDeleteVideoDialog = () => {
    setDeleteVideoDialogOpen(false);
    setVideoToDelete(null);
  };

  const confirmDeleteVideo = () => {
    if (videoToDelete) {
      handleDeleteVideo(videoToDelete);
    }
    closeDeleteVideoDialog();
  };

  const menuItems = [
    { label: 'Upload Video', icon: Upload, action: () => setIsModalOpen(true) },
    { label: 'All Users', icon: Users, action: handleAllUsersClick },
    { label: 'Logout', icon: LogOut, action: handleSignOut }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex flex-col">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-between px-4 sm:px-6 md:px-12 py-4"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white sm:hidden">
            <Menu size={24} />
          </button>
          <img src={ytLogo} alt="Mini-YouTube" className="h-6" />
          <span className="font-bold text-lg sm:text-xl text-white">Mini-YouTube</span>
        </div>
        <div className="hidden sm:block">
          <span className="font-bold text-xl sm:text-2xl text-white">
            Hii {adminName || 'Admin'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)} className="hidden sm:flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white">
            <Upload size={18} />
            <span className="ml-2">Upload</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAllUsersClick} className="hidden sm:flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-white">
            <Users size={18} />
            <span className="ml-2">All Users</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSignOut} className="flex items-center bg-red-600 hover:bg-red-700 p-2 sm:px-4 sm:py-2 rounded-full text-white">
            <LogOut size={18} />
            <span className="hidden sm:inline ml-2">Logout</span>
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3 }} className="fixed top-0 left-0 h-full w-64 bg-gradient-to-bl from-[#a1c4fd] via-[#c2e9fb] to-[#d4fc79] shadow-xl z-50 p-6 sm:hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={ytLogo} alt="Mini-YouTube" className="h-5" />
                <span className="font-bold text-gray-900">Mini-YouTube</span>
              </div>
              <button onClick={() => { setSidebarOpen(false); setActiveMobileSection('menu'); }}>
                <X className="w-6 h-6 text-gray-700 hover:text-red-500" />
              </button>
            </div>

            {activeMobileSection === 'menu' ? (
              <nav className="flex flex-col gap-4">
                {menuItems.map(({ label, icon: Icon, action }, idx) => (
                  <button key={idx} onClick={() => { action(); if (label !== 'All Users') setSidebarOpen(false); }} className="flex items-center gap-3 text-gray-800 hover:text-blue-700">
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </nav>
            ) : (
              <div className="text-gray-800">
                <h2 className="text-lg font-bold mb-4">All Users</h2>
                {isUsersLoading ? (
                  <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                    <LoadingSpinner />
                  </div>
                ) : hasUsersFetchFailed && showUsersRetry ? (
                  <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                    <RetryButton onClick={fetchUsers} />
                  </div>
                ) : hasUsersFetchFailed ? (
                  <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                    <LoadingSpinner />
                  </div>
                ) : users.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  users.map(user => (
                    <div key={user._id} className="flex justify-between items-center p-2 bg-white rounded-md mb-2">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button onClick={() => openDeleteUserDialog(user._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUsersSidebarOpen && (
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 h-full w-64 bg-gradient-to-bl from-[#a1c4fd] via-[#c2e9fb] to-[#d4fc79] shadow-xl z-50 p-6 hidden sm:block">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Users size={20} />
                <span className="font-bold">All Users</span>
              </div>
              <button onClick={() => setIsUsersSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-700 hover:text-red-500" />
              </button>
            </div>
            {isUsersLoading ? (
              <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <LoadingSpinner />
              </div>
            ) : hasUsersFetchFailed && showUsersRetry ? (
              <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <RetryButton onClick={fetchUsers} />
              </div>
            ) : hasUsersFetchFailed ? (
              <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <LoadingSpinner />
              </div>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map(user => (
                <div key={user._id} className="flex justify-between items-center p-2 bg-white rounded-md mb-2">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button onClick={() => openDeleteUserDialog(user._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="pt-[100px] pb-10 px-4 sm:px-6">
        {isVideosLoading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <div className="spinner-wrapper">
              <LoadingSpinner />
            </div>
          </div>
        ) : hasVideosFetchFailed && showVideosRetry ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <RetryButton onClick={fetchVideos} />
          </div>
        ) : hasVideosFetchFailed ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <div className="spinner-wrapper">
              <LoadingSpinner />
            </div>
          </div>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos found.</p>
        ) : (
          <AdminVideoCard
            videos={videos}
            handleEdit={handleEditVideo}
            handleDelete={openDeleteVideoDialog}
          />
        )}
      </main>

      <ConfirmDialog
        open={deleteUserDialogOpen}
        onClose={closeDeleteUserDialog}
        onConfirm={confirmDeleteUser}
        title="Confirm Delete User"
        message="Are you sure you want to delete this user?"
      />

      <ConfirmDialog
        open={deleteVideoDialogOpen}
        onClose={closeDeleteVideoDialog}
        onConfirm={confirmDeleteVideo}
        title="Confirm Delete Video"
        message="Are you sure you want to delete this video?"
      />

      <UploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedVideo={selectedVideo}
        onVideoUpload={addVideoToList}
        onVideoUpdate={updateVideoInList}
      />
    </div>
  );
};

export default AdminDash;