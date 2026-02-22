import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from '../features/auth/authSlice';
import reportReducer from '../features/report/reportSlice';
import subscriptionReducer from '../features/subscription/subscriptionSlice';
import fileReducer from '../features/file/fileSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  report: reportReducer,
  subscription: subscriptionReducer,
  file: fileReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'subscription'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
