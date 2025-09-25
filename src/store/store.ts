// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình Persist
const persistConfig = {
  key: 'root', // Key cho storage
  storage: AsyncStorage,
  whitelist: ['auth'], // Chỉ persist reducer 'auth'
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer, // Sử dụng reducer đã được persist
  },
  // Middleware cần thiết để bỏ qua các action của redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Xuất ra persistor để sử dụng trong App.js
export const persistor = persistStore(store);