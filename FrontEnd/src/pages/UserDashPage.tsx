import React, { useEffect, useState } from 'react';
import UserDashHeader from '../components/UserDashHeader';
import VideoCard from '../components/UserVideoCard';
import RetryButton from '../components/RetryButton';
import { useAuth } from '../services/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchVideos, fetchVideosWithSearch } from '../redux/slices/videosSlice';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { toggleLike, toggleDislike } from '../redux/slices/likesSlice';
import { incrementAllViews } from '../redux/slices/viewsSlice';

interface Video {
  _id: string;
  videoId: string;
  title: string;
  description: string;
  url: string;
  categoryId: number;
  likes: string[];
  dislikes: string[];
  uploadDate: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const UserDashPage: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const dispatch = useAppDispatch();
  const videos = useAppSelector((state) => state.videos.items);
  const videosStatus = useAppSelector((state) => state.videos.status);
  const watchlistVideos = useAppSelector((state) => state.watchlist.items);
  const watchlistStatus = useAppSelector((state) => state.watchlist.status);
  const likesStatus = useAppSelector((state) => state.likes.status);
  const likesError = useAppSelector((state) => state.likes.error);
  const [showVideosRetry, setShowVideosRetry] = useState<boolean>(false);
  const [showWatchlistRetry, setShowWatchlistRetry] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasIncrementedViews, setHasIncrementedViews] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<string | null>(null); // Loading state for like/dislike
  const userId = (user as any)?._id || (user as any)?.id || '';

  useEffect(() => {
    let isMounted = true;

    if (user && isMounted) {
      if (videosStatus === 'idle') {
        setShowVideosRetry(false);
        dispatch(fetchVideos()).then((result) => {
          if ('error' in result && result.error) {
            const errorMessage = (result.payload as any)?.message || 'Failed to fetch videos';
            if (errorMessage === 'No token found') {
              logout();
            }
            setTimeout(() => {
              setShowVideosRetry(true);
            }, 2000);
          }
        });
      }

      if (watchlistStatus === 'idle') {
        setShowWatchlistRetry(false);
        dispatch(fetchWatchlist()).then((result) => {
          if ('error' in result && result.error) {
            const errorMessage = (result.payload as any)?.message || 'Failed to fetch watchlist';
            if (errorMessage === 'No token found') {
              logout();
            }
            setTimeout(() => {
              setShowWatchlistRetry(true);
            }, 2000);
          }
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user, videosStatus, watchlistStatus, dispatch, logout]);

  useEffect(() => {
    if (user && videosStatus === 'succeeded' && videos.length > 0 && !hasIncrementedViews) {
      dispatch(incrementAllViews(videos.map((video) => video.videoId)));
      setHasIncrementedViews(true);
    }
  }, [user, videosStatus, videos, dispatch, hasIncrementedViews]);

  useEffect(() => {
    if (user) {
      if (searchQuery.trim() === '') {
        dispatch(fetchVideos());
      } else {
        dispatch(fetchVideosWithSearch(searchQuery));
      }
    }
  }, [searchQuery, dispatch, user]);

  const handleLike = async (videoId: string) => {
    if (!user) {
      logout();
      return;
    }

    const videoToUpdate = videos.find((video) => video.videoId === videoId);
    if (!videoToUpdate) return;

    setIsInteracting(videoId); // Show loading state
    try {
      const result = await dispatch(toggleLike(videoId));
      if ('error' in result && result.error) {
        throw new Error((result.payload as any)?.message || 'Failed to like video');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to like video');
    } finally {
      setIsInteracting(null); // Hide loading state
    }
  };

  const handleDislike = async (videoId: string) => {
    if (!user) {
      logout();
      return;
    }

    const videoToUpdate = videos.find((video) => video.videoId === videoId);
    if (!videoToUpdate) return;

    setIsInteracting(videoId); // Show loading state
    try {
      const result = await dispatch(toggleDislike(videoId));
      if ('error' in result && result.error) {
        throw new Error((result.payload as any)?.message || 'Failed to dislike video');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to dislike video');
    } finally {
      setIsInteracting(null); // Hide loading state
    }
  };

  const handleToggleWatchlist = async (videoId: string, isInWatchlist: boolean) => {
    if (!user) {
      logout();
      return;
    }

    const videoToToggle = videos.find((video) => video.videoId === videoId);
    if (!videoToToggle) return;

    try {
      if (isInWatchlist) {
        const result = await dispatch(removeFromWatchlist(videoId));
        if ('error' in result && result.error) {
          throw new Error((result.payload as any)?.message || 'Failed to remove from watchlist');
        }
      } else {
        const result = await dispatch(addToWatchlist(videoId));
        if ('error' in result && result.error) {
          throw new Error((result.payload as any)?.message || 'Failed to add to watchlist');
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return null;
  }

  if (!user || !localStorage.getItem('userToken')) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <header className="sticky top-0 z-40">
        <UserDashHeader onSearch={handleSearch} />
      </header>

      <main className="pt-[108px] sm:pt-[60px] pb-10 px-4 sm:px-6 bg-gray-100">
        {(videosStatus === 'loading' || watchlistStatus === 'loading') ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-60px)] bg-gray-100">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        ) : (videosStatus === 'failed' || watchlistStatus === 'failed') && (showVideosRetry || showWatchlistRetry) ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-60px)] bg-gray-100">
            <RetryButton
              onClick={() => {
                if (videosStatus === 'failed') {
                  setShowVideosRetry(false);
                  dispatch(fetchVideos()).then((result) => {
                    if ('error' in result && result.error) {
                      setTimeout(() => {
                        setShowVideosRetry(true);
                      }, 2000);
                    }
                  });
                }
                if (watchlistStatus === 'failed') {
                  setShowWatchlistRetry(false);
                  dispatch(fetchWatchlist()).then((result) => {
                    if ('error' in result && result.error) {
                      setTimeout(() => {
                        setShowWatchlistRetry(true);
                      }, 2000);
                    }
                  });
                }
              }}
            />
          </div>
        ) : (videosStatus === 'failed' || watchlistStatus === 'failed') ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-60px)] bg-gray-100">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        ) : (likesStatus === 'failed') ? (
          <p className="text-center text-red-600 py-4">{likesError}</p>
        ) : videosStatus === 'succeeded' && videos.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            {searchQuery ? 'No videos match your search.' : 'No videos available.'}
          </p>
        ) : videosStatus === 'succeeded' && videos.length > 0 ? (
          <VideoCard
            videos={videos}
            handleLike={handleLike}
            handleDislike={handleDislike}
            toggleWatchlist={handleToggleWatchlist}
            watchlistVideos={watchlistVideos}
            isInteracting={isInteracting} // Pass loading state to VideoCard
          />
        ) : null}
      </main>
    </>
  );
};

export default UserDashPage;