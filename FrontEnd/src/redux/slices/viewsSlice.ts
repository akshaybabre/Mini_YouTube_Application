import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ViewsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ViewsState = {
  status: 'idle',
  error: null,
};

export const incrementAllViews = createAsyncThunk(
  'views/incrementAllViews',
  async (videoIds: string[], { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('https://mini-youtube-backend-hnra.onrender.com/api/videos/increment-all-views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to increment views');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to increment views');
    }
  }
);

const viewsSlice = createSlice({
  name: 'views',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(incrementAllViews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(incrementAllViews.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(incrementAllViews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default viewsSlice.reducer;