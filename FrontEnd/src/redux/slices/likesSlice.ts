import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface LikesState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LikesState = {
  status: 'idle',
  error: null,
};

export const toggleLike = createAsyncThunk(
  'likes/toggleLike',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch(`https://mini-youtube-fdhn.onrender.com/api/interact/${videoId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like video');
      }

      const data = await response.json();
      return {
        videoId,
        updatedVideo: {
          ...data,
          uploadDate: new Date(data.uploadDate).toISOString(),
          createdAt: new Date(data.createdAt).toISOString(),
          updatedAt: new Date(data.updatedAt).toISOString(),
        },
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to like video');
    }
  }
);

export const toggleDislike = createAsyncThunk(
  'likes/toggleDislike',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch(`https://mini-youtube-fdhn.onrender.com/api/interact/${videoId}/dislike`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to dislike video');
      }

      const data = await response.json();
      return {
        videoId,
        updatedVideo: {
          ...data,
          uploadDate: new Date(data.uploadDate).toISOString(),
          createdAt: new Date(data.createdAt).toISOString(),
          updatedAt: new Date(data.updatedAt).toISOString(),
        },
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to dislike video');
    }
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(toggleDislike.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleDislike.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(toggleDislike.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default likesSlice.reducer;