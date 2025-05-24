import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleLike, toggleDislike } from './likesSlice';
import { incrementAllViews } from './viewsSlice';

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

interface VideosState {
  items: Video[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VideosState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchVideos = createAsyncThunk('videos/fetchVideos', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No token found');

    const response = await fetch('http://localhost:5000/api/public/videos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch videos');
    }

    const data = await response.json();
    return data.map((video: any) => ({
      ...video,
      uploadDate: new Date(video.uploadDate).toISOString(),
      createdAt: new Date(video.createdAt).toISOString(),
      updatedAt: new Date(video.updatedAt).toISOString(),
    }));
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch videos');
  }
});

export const fetchVideosWithSearch = createAsyncThunk(
  'videos/fetchVideosWithSearch',
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch(`http://localhost:5000/api/public/videos?search=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch videos');
      }

      const data = await response.json();
      return data.map((video: any) => ({
        ...video,
        uploadDate: new Date(video.uploadDate).toISOString(),
        createdAt: new Date(video.createdAt).toISOString(),
        updatedAt: new Date(video.updatedAt).toISOString(),
      }));
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch videos');
    }
  }
);

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    addVideo: (state, action) => {
      state.items.push(action.payload);
    },
    updateVideo: (state, action) => {
      const updatedVideo = action.payload;
      const index = state.items.findIndex((video) => video.videoId === updatedVideo.videoId);
      if (index !== -1) {
        state.items[index] = updatedVideo;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchVideosWithSearch.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVideosWithSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVideosWithSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { videoId, updatedVideo } = action.payload;
        const index = state.items.findIndex((video) => video.videoId === videoId);
        if (index !== -1) {
          state.items[index] = {
            ...updatedVideo,
            uploadDate: new Date(updatedVideo.uploadDate).toISOString(),
            createdAt: new Date(updatedVideo.createdAt).toISOString(),
            updatedAt: new Date(updatedVideo.updatedAt).toISOString(),
          };
        }
      })
      .addCase(toggleDislike.fulfilled, (state, action) => {
        const { videoId, updatedVideo } = action.payload;
        const index = state.items.findIndex((video) => video.videoId === videoId);
        if (index !== -1) {
          state.items[index] = {
            ...updatedVideo,
            uploadDate: new Date(updatedVideo.uploadDate).toISOString(),
            createdAt: new Date(updatedVideo.createdAt).toISOString(),
            updatedAt: new Date(updatedVideo.updatedAt).toISOString(),
          };
        }
      })
      .addCase(incrementAllViews.fulfilled, (state, action) => {
        const updatedVideos = action.payload;
        updatedVideos.forEach((updatedVideo: Video) => {
          const index = state.items.findIndex((video) => video.videoId === updatedVideo.videoId);
          if (index !== -1) {
            state.items[index] = {
              ...updatedVideo,
              uploadDate: new Date(updatedVideo.uploadDate).toISOString(),
              createdAt: new Date(updatedVideo.createdAt).toISOString(),
              updatedAt: new Date(updatedVideo.updatedAt).toISOString(),
            };
          }
        });
      });
  },
});

export const { addVideo, updateVideo } = videosSlice.actions;
export default videosSlice.reducer;