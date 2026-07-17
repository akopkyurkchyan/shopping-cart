import type { RootState } from '../../app/store';

export const selectShoppingHistory = (state: RootState) => state.shopping.carts;
export const selectShoppingStatus = (state: RootState) => state.shopping.status;
export const selectShoppingSaveStatus = (state: RootState) =>
  state.shopping.saveStatus;
export const selectShoppingError = (state: RootState) => state.shopping.error;
