import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from 'const/Language';
import { IAppState, Language, Maps } from 'types/types';

const initialState: IAppState = {
  maps: {},
  lang: Language.Eng,
  music: true,
  sound: true,
};

/* eslint-disable no-param-reassign */
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
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
  setMaps, setLang, setMusic, setSound,
} = appSlice.actions;

export default appSlice.reducer;
