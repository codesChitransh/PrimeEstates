import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,  // Connect the user slice to the store
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,  // Disable serializable check
  }),
});
