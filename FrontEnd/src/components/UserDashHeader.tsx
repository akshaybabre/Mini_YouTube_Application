import React, { useState } from 'react';
import ytLogo from '../assets/yt.png';
import { Search, ListVideo, X, Eye, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { User } from 'firebase/auth';
import { addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { toggleLike, toggleDislike } from '../redux/slices/likesSlice';
import CustomLikeButton from './CustomLikeButton';

interface UserDashHeaderProps {
  onSearch: (query: string) => void;
}

const UserDashHeader: React.FC<UserDashHeaderProps> = ({ onSearch }) => {
  const [rightMenuOpen, setRightMenuOpen] = useState<boolean>(false);
  const [watchlistOpen, setWatchlistOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const dispatch = useAppDispatch();
  const watchlistVideos = useAppSelector((state) => state.watchlist.items);
  const watchlistStatus = useAppSelector((state) => state.watchlist.status);
  const watchlistError = useAppSelector((state) => state.watchlist.error);
  const userId = (user as any)?._id || (user as any)?.id || '';

  const isFirebaseUser = (user: any): user is User => {
    return (user as User).uid !== undefined;
  };

  const userName = user
    ? isFirebaseUser(user)
      ? user.displayName || 'Guest'
      : user.username || 'Guest'
    : 'Guest';

  const userEmail = user?.email || '';

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
    }
  };

  const handleLike = (videoId: string) => {
    if (!user) {
      logout();
      return;
    }
    dispatch(toggleLike(videoId));
  };

  const handleDislike = (videoId: string) => {
    if (!user) {
      logout();
      return;
    }
    dispatch(toggleDislike(videoId));
  };

  const handleToggleWatchlist = async (videoId: string, isInWatchlist: boolean) => {
    if (!user) {
      logout();
      return;
    }

    try {
      if (isInWatchlist) {
        await dispatch(removeFromWatchlist(videoId)).unwrap();
      } else {
        await dispatch(addToWatchlist(videoId)).unwrap();
      }
    } catch (err: any) {
    }
  };

  const firstLetter = userName.charAt(0).toUpperCase();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 shadow-md bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#d4fc79] backdrop-blur-sm"
      >
        <div className="h-[60px] flex items-center justify-between px-4 md:px-8">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <img src={ytLogo} alt="Mini-YouTube" className="h-6" />
            <span className="text-lg font-extrabold text-gray-800">Mini-YouTube</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden md:flex flex-1 max-w-xl mx-6"
          >
            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-2 text-sm bg-white text-gray-800 rounded-l-full border border-gray-300 focus:outline-none shadow-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="bg-gray-800 text-white px-4 py-2 rounded-r-full border-l border-gray-300 hover:bg-gray-700 transition-all duration-200">
              <Search size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="relative flex items-center gap-4"
          >
            <button
              onClick={() => setWatchlistOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900"
              aria-label="Watchlist"
            >
              <ListVideo size={20} />
            </button>

            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center hover:bg-blue-800"
            >
              {firstLetter}
            </button>

            <AnimatePresence>
              {rightMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <div className="font-bold">{userName}</div>
                    <div className="text-sm text-gray-600">{userEmail}</div>
                  </div>
                  <div className="flex flex-col py-2">
                    <button
                      onClick={handleSignOut}
                      className="text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="block md:hidden px-4 py-2 border-t border-gray-300"
        >
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-2 text-sm bg-white text-gray-800 rounded-l-full border border-gray-300 focus:outline-none shadow-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="bg-gray-800 text-white px-4 py-2 rounded-r-full border-l border-gray-300 hover:bg-gray-700 transition-all duration-200">
              <Search size={18} />
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {watchlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setWatchlistOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="
                  fixed top-0 right-0 bottom-0 
                  w-[300px] md:w-[400px]
                  bg-white z-50 shadow-lg p-4
                  overflow-y-auto scrollbar-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Your Watchlist</h2>
                <button
                  onClick={() => setWatchlistOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>

              {watchlistStatus === 'loading' && (
                <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                  <p className="text-gray-600 text-lg">Loading...</p>
                </div>
              )}
              {watchlistStatus === 'failed' && (
                <p className="text-sm text-red-600">{watchlistError}</p>
              )}
              {watchlistStatus === 'succeeded' && watchlistVideos.length === 0 && (
                <p className="text-sm text-gray-500">No items yet — add videos to your watchlist!</p>
              )}
              {watchlistStatus === 'succeeded' && watchlistVideos.length > 0 && (
                <div className="space-y-6">
                  {watchlistVideos.map((video) => {
                    const hasLiked = video.likes.includes(userId);
                    const hasDisliked = video.dislikes.includes(userId);
                    const isInWatchlist = watchlistVideos.some((v) => v.videoId === video.videoId);

                    return (
                      <div
                        key={video.videoId}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition hover:shadow-xl"
                      >
                        <div className="aspect-w-16 aspect-h-9 relative">
                          <iframe
                            className="w-full h-full"
                            src={`${video.url}?autoplay=0`}
                            title={video.title}
                            style={{ border: 0 }}
                            allow="encrypted-media"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
                          <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4">
                              <CustomLikeButton
                                type="like"
                                checked={hasLiked}
                                onClick={() => handleLike(video.videoId)}
                                count={video.likes.length}
                              />
                              <CustomLikeButton
                                type="dislike"
                                checked={hasDisliked}
                                onClick={() => handleDislike(video.videoId)}
                                count={video.dislikes.length}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Eye className="w-5 h-5 text-gray-500" />
                              <span className="text-sm text-gray-500">{video.views} views</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleWatchlist(video.videoId, isInWatchlist)}
                            className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                              isInWatchlist
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                          >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDashHeader;