import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './features/auth/authSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
   // demography: demographyReducer
    // [authApi.reducerPath]: authApi.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware().concat(authApi.middleware),

})


setupListeners(store.dispatch)

