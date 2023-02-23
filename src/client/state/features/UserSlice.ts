import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AuthService from 'client/services/AuthService';
import LocalStorageService from 'client/services/LocalStorageService';
import {
  AuthResponse, AxiosErrorResponse, IUserState, LoginData, User,
} from 'common/types/types';

const initialState: IUserState = {
  isLoading: false,
  isAuth: false,
  user: {} as User,
};

export const axiosSignIn = createAsyncThunk<
AuthResponse,
LoginData,
{ rejectValue: AxiosErrorResponse | undefined }
>('user/axiosSignIn', async (payload: LoginData, { rejectWithValue }) => {
  try {
    const authResponse = await AuthService.signIn(payload.email, payload.password);
    LocalStorageService.setAccessToken(authResponse.data.accessToken);
    return authResponse.data;
  } catch (e: unknown) {
    return rejectWithValue((e as AxiosError<AxiosErrorResponse>).response?.data);
  }
});

export const axiosSignUp = createAsyncThunk<
AuthResponse,
User,
{ rejectValue: AxiosErrorResponse | undefined }
>('user/axiosSignUn', async (payload: User, { rejectWithValue }) => {
  try {
    const authResponse = await AuthService.signUp(
      payload.email,
      payload.username,
      payload.password,
    );
    LocalStorageService.setAccessToken(authResponse.data.accessToken);
    return authResponse.data;
  } catch (e: unknown) {
    return rejectWithValue((e as AxiosError<AxiosErrorResponse>).response?.data);
  }
});

export const axiosSignOut = createAsyncThunk<
null,
undefined,
{ rejectValue: AxiosErrorResponse | undefined }
>('user/axiosSignOut', async (_: undefined, { rejectWithValue }) => {
  try {
    await AuthService.signOut();
    LocalStorageService.removeAccessToken();
    return null;
  } catch (e: unknown) {
    return rejectWithValue((e as AxiosError<AxiosErrorResponse>).response?.data);
  }
});

export const axiosCheckAuth = createAsyncThunk<AuthResponse, undefined>(
  'user/axiosCheckAuth',
  async (_: undefined, { rejectWithValue }) => {
    try {
      const authResponse = await AuthService.refresh();
      LocalStorageService.setAccessToken(authResponse.data.accessToken);
      return authResponse.data;
    } catch (e: unknown) {
      return rejectWithValue(e);
    }
  },
);

/* eslint-disable no-param-reassign */
function setState(state: IUserState, isAuth: boolean, user: User, isLoading: boolean) {
  state.isAuth = isAuth;
  state.user = user;
  state.isLoading = isLoading;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(axiosSignIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(axiosSignIn.rejected, (state, action) => {
        // There we will call the method that will show errors on forms.
        console.log('rejected', action.error);
        state.isLoading = false;
      })
      .addCase(axiosSignIn.fulfilled, (state, action) => {
        setState(state, true, action.payload.user, false);
      })
      .addCase(axiosSignUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(axiosSignUp.rejected, (state, action) => {
        // There we will call the method that will show errors on forms.
        console.log('rejected', action.error);
        state.isLoading = false;
      })
      .addCase(axiosSignUp.fulfilled, (state, action) => {
        setState(state, true, action.payload.user, false);
      })
      .addCase(axiosSignOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(axiosSignOut.rejected, (state, action) => {
        // There we will call the method that will show errors on forms.
        console.log('rejected', action.error);
        state.isLoading = false;
      })
      .addCase(axiosSignOut.fulfilled, (state) => {
        setState(state, false, {} as User, false);
      })
      .addCase(axiosCheckAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(axiosCheckAuth.rejected, (state) => {
        setState(state, false, {} as User, false);
      })
      .addCase(axiosCheckAuth.fulfilled, (state, action) => {
        setState(state, true, action.payload.user, false);
      });
  },
});

/* eslint-enable no-param-reassign */

export const { setIsLoading, setAuth, setUser } = userSlice.actions;

export default userSlice.reducer;
