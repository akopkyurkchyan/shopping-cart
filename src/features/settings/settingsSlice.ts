import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getCurrencySetting,
  setCurrencySetting,
} from '../../db/settingsRepository';
import type { AppCurrencyCode } from '../../types/settings';

type SettingsState = {
  currency: AppCurrencyCode;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: SettingsState = {
  currency: null,
  status: 'idle',
  error: null,
};

export const loadSettings = createAsyncThunk('settings/load', async () => {
  const currency = await getCurrencySetting();

  return { currency };
});

export const updateCurrency = createAsyncThunk(
  'settings/updateCurrency',
  async (currency: AppCurrencyCode) => {
    await setCurrencySetting(currency);

    return currency;
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadSettings.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currency = action.payload.currency;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load settings';
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.currency = action.payload;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update currency';
      });
  },
});

export const settingsReducer = settingsSlice.reducer;
