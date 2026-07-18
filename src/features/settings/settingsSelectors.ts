import type { RootState } from '../../app/store';

export const selectCurrency = (state: RootState) => state.settings.currency;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectSettingsStatus = (state: RootState) => state.settings.status;
