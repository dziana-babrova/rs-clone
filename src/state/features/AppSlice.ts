import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { LocalStorageKeys } from 'const/AppConstants';
import { Language } from 'const/Language';
import LocalStorageService from 'services/LocalStorageService';
import MapsApiService from 'services/MapsApiService';
import MapService from 'services/MapService';
import { AxiosErrorResponse, IAppState, Maps } from 'types/types';

const initialState: IAppState = {
  maps: {},
  lang: Language.Eng,
  music: true,
  sound: true,
};

export const axiosGetMaps = createAsyncThunk<
Maps,
undefined,
{ rejectValue: AxiosErrorResponse | undefined }
>('app/axiosGetMaps', async (_: undefined, { rejectWithValue }) => {
  try {
    const mapsResponse = await MapsApiService.getMaps();
    LocalStorageService.setItem<Maps>(LocalStorageKeys.levels, mapsResponse.data);
    return mapsResponse.data;
  } catch (e: unknown) {
    return rejectWithValue((e as AxiosError<AxiosErrorResponse>).response?.data);
  }
});
export const axiosUpdateMaps = createAsyncThunk<
null,
Maps,
{ rejectValue: AxiosErrorResponse | undefined }
>('app/axiosUpdateMaps', async (payload: Maps, { rejectWithValue }) => {
  try {
    await MapsApiService.updateMaps(payload);
    return null;
  } catch (e: unknown) {
    return rejectWithValue((e as AxiosError<AxiosErrorResponse>).response?.data);
  }
});

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
  extraReducers: (builder) => {
    builder
      .addCase(axiosGetMaps.fulfilled, (state, action) => {
        state.maps = action.payload;
      })
      .addCase(axiosGetMaps.rejected, (state) => {
        state.maps = MapService.getDefaultMapsObject();
      })
      .addCase(axiosUpdateMaps.rejected, (state, action) => {
        // There we will call the method that will show errors on forms.
        console.log('Not saved', action.error);
      });
  },
});
/* eslint-enable no-param-reassign */

export const {
  setMaps, setLang, setMusic, setSound,
} = appSlice.actions;

export default appSlice.reducer;
