import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  deleteCart,
  getAllCarts,
  saveCart,
} from '../../db/shoppingRepository';
import type {
  ShoppingCart,
  ShoppingCartDraftProduct,
  ShoppingCartSummary,
} from '../../types/models';

type SaveShoppingCartPayload = {
  id: string;
  title: string;
  date: string;
  createdAt: string;
  products: ShoppingCartDraftProduct[];
};

type ShoppingState = {
  carts: ShoppingCartSummary[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  saveStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ShoppingState = {
  carts: [],
  status: 'idle',
  saveStatus: 'idle',
  error: null,
};

export const loadShoppingHistory = createAsyncThunk(
  'shopping/loadHistory',
  async () => {
    return getAllCarts();
  },
);

export const saveShoppingCart = createAsyncThunk<
  ShoppingCart,
  SaveShoppingCartPayload
>('shopping/saveCart', async payload => {
  return saveCart(payload);
});

export const deleteShoppingCart = createAsyncThunk<string, string>(
  'shopping/deleteCart',
  async id => {
    await deleteCart(id);
    return id;
  },
);

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    clearShoppingError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadShoppingHistory.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        loadShoppingHistory.fulfilled,
        (state, action: PayloadAction<ShoppingCartSummary[]>) => {
          state.status = 'succeeded';
          state.carts = action.payload;
        },
      )
      .addCase(loadShoppingHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message ?? 'Failed to load shopping history';
      })
      .addCase(saveShoppingCart.pending, state => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(
        saveShoppingCart.fulfilled,
        (state, action: PayloadAction<ShoppingCart>) => {
          state.saveStatus = 'succeeded';

          const summary: ShoppingCartSummary = {
            id: action.payload.id,
            title: action.payload.title,
            date: action.payload.date,
            total: action.payload.total,
            createdAt: action.payload.createdAt,
          };
          const existingIndex = state.carts.findIndex(
            cart => cart.id === summary.id,
          );

          if (existingIndex >= 0) {
            state.carts[existingIndex] = summary;
          } else {
            state.carts.push(summary);
          }

          state.carts.sort((left, right) => {
            if (left.date === right.date) {
              return right.createdAt.localeCompare(left.createdAt);
            }

            return right.date.localeCompare(left.date);
          });
        },
      )
      .addCase(saveShoppingCart.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.error.message ?? 'Failed to save shopping cart';
      })
      .addCase(deleteShoppingCart.pending, state => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(
        deleteShoppingCart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.saveStatus = 'succeeded';
          state.carts = state.carts.filter(cart => cart.id !== action.payload);
        },
      )
      .addCase(deleteShoppingCart.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.error.message ?? 'Failed to delete shopping cart';
      });
  },
});

export const { clearShoppingError } = shoppingSlice.actions;
export const shoppingReducer = shoppingSlice.reducer;
