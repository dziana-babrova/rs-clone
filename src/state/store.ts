import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './features/GameSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
  },
});

export default store;
