import { configureStore } from '@reduxjs/toolkit';
import videosReducer from '../slices/videosSlice';
import likesReducer from '../slices/likesSlice';
import viewsReducer from '../slices/viewsSlice';
import watchlistReducer from '../slices/watchlistSlice';

export const store = configureStore({
  reducer: {
    videos: videosReducer,
    likes: likesReducer,
    views: viewsReducer,
    watchlist: watchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;