import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

interface WatchlistState {
  items: Video[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('https://mini-youtube-backend-hnra.onrender.com/api/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch watchlist');
      }

      const data = await response.json();
      return data.map((video: any) => ({
        ...video,
        uploadDate: new Date(video.uploadDate).toISOString(),
        createdAt: new Date(video.createdAt).toISOString(),
        updatedAt: new Date(video.updatedAt).toISOString(),
      }));
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch(`https://mini-youtube-backend-hnra.onrender.com/api/watchlist/${videoId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to watchlist');
      }

      await response.json();
      const videoResponse = await fetch(`https://mini-youtube-backend-hnra.onrender.com/api/public/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!videoResponse.ok) {
        throw new Error('Failed to fetch video details');
      }

      const videos = await videoResponse.json();
      const video = videos.find((v: Video) => v.videoId === videoId);
      if (!video) throw new Error('Video not found');

      return {
        ...video,
        uploadDate: new Date(video.uploadDate).toISOString(),
        createdAt: new Date(video.createdAt).toISOString(),
        updatedAt: new Date(video.updatedAt).toISOString(),
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch(`https://mini-youtube-backend-hnra.onrender.com/api/watchlist/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove from watchlist');
      }

      return videoId;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to remove from watchlist');
    }
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    clearWatchlist: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addToWatchlist.pending, (state) => {
        state.error = null; // Remove status: 'loading'
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(removeFromWatchlist.pending, (state) => {
        state.error = null; // Remove status: 'loading'
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((video) => video.videoId !== action.payload);
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;