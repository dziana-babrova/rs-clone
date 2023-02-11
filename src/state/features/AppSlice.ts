import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IAppState, Language, Maps, User,
} from 'types/types';

const initialState: IAppState = {
  user: null,
  maps: null,
  lang: Language.Eng,
  music: true,
  sound: true,
};

/* eslint-disable no-param-reassign */
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setMaps: (state, action: PayloadAction<Maps>) => {
      state.maps = action.payload;
    },
    setLang: (state, action: PayloadAction<Language>) => {
      state.lang = action.payload;
    },
    setMusic: (state, action: PayloadAction<boolean>) => {
      state.music = action.payload;
    },
    setSound: (state, action: PayloadAction<boolean>) => {
      state.sound = action.payload;
    },
  },
});
/* eslint-enable no-param-reassign */

export const {
  setUser, setMaps, setLang, setMusic, setSound,
} = appSlice.actions;

export default appSlice.reducer;
