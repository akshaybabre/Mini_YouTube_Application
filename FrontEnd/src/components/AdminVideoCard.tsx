import React from 'react';
import { ThumbsUp, ThumbsDown, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface AdminVideoCardProps {
  videos: Video[];
  handleEdit: (videoId: string) => void;
  handleDelete: (videoId: string) => void;
}

const AdminVideoCard: React.FC<AdminVideoCardProps> = ({
  videos,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="w-full px-2 sm:px-6 lg:px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={video.videoId}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={video.url}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{video.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-gray-700">
                  <span className="flex items-center">
                    <ThumbsUp className="w-5 h-5 mr-1" />
                    {video.likes.length}
                  </span>
                  <span className="flex items-center">
                    <ThumbsDown className="w-5 h-5 mr-1" />
                    {video.dislikes.length}
                  </span>
                </div>
                <span className="flex items-center text-gray-500 text-sm">
                  <Eye className="w-5 h-5 mr-1" />
                  {video.views || 0} views
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(video.videoId)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video.videoId)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminVideoCard;