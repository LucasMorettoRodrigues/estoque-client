import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import providerReducer from '../features/provider/providerSlice'
import productsReducer from '../features/product/productSlice';
import authenticationReducer from '../features/authentication/authentication'
import notificationReducer from '../features/notification/notificationSlice';
import historicSlice from '../features/historic/historicSlice';
import inventorySlice from '../features/inventory/inventorySlice';

export const store = configureStore({
  reducer: {
    provider: providerReducer,
    product: productsReducer,
    authentication: authenticationReducer,
    notification: notificationReducer,
    historic: historicSlice,
    inventory: inventorySlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
