import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getCurrencySetting,
  getLanguageSetting,
  setCurrencySetting,
  setLanguageSetting,
} from '../../db/settingsRepository';
import { applyLanguage } from '../../i18n';
import {
  DEFAULT_LANGUAGE_PREFERENCE,
  type AppCurrencyCode,
  type AppLanguagePreference,
} from '../../types/settings';

type SettingsState = {
  currency: AppCurrencyCode;
  language: AppLanguagePreference;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: SettingsState = {
  currency: null,
  language: DEFAULT_LANGUAGE_PREFERENCE,
  status: 'idle',
  error: null,
};

export const loadSettings = createAsyncThunk('settings/load', async () => {
  const [currency, language] = await Promise.all([
    getCurrencySetting(),
    getLanguageSetting(),
  ]);

  await applyLanguage(language);

  return { currency, language };
});

export const updateCurrency = createAsyncThunk(
  'settings/updateCurrency',
  async (currency: AppCurrencyCode) => {
    await setCurrencySetting(currency);

    return currency;
  },
);

export const updateLanguage = createAsyncThunk(
  'settings/updateLanguage',
  async (language: AppLanguagePreference) => {
    await setLanguageSetting(language);
    await applyLanguage(language);

    return language;
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
        state.language = action.payload.language;
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
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.language = action.payload;
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update language';
      });
  },
});

export const settingsReducer = settingsSlice.reducer;
