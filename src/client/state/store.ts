import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './features/AppSlice';
import UserSlice from './features/UserSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    user: UserSlice,
  },
});

export default store;
