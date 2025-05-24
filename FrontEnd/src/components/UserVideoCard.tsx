import React from 'react';
import { Eye, PlusCircle } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import CustomLikeButton from './CustomLikeButton';

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

interface VideoCardProps {
  videos: Video[];
  handleLike: (videoId: string) => void;
  handleDislike: (videoId: string) => void;
  toggleWatchlist: (videoId: string, isInWatchlist: boolean) => void;
  watchlistVideos: Video[];
}

const VideoCard: React.FC<VideoCardProps> = ({
  videos,
  handleLike,
  handleDislike,
  toggleWatchlist,
  watchlistVideos,
}) => {
  const { user } = useAuth();
  const userId = (user as any)?._id || (user as any)?.id || '';

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Featured Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
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
                  onClick={() => toggleWatchlist(video.videoId, isInWatchlist)}
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
    </div>
  );
};

export default React.memo(VideoCard);