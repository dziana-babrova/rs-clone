import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './features/AppSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
  },
});

export default store;
