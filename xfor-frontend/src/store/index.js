import { configureStore } from '@reduxjs/toolkit';

import APIErrorsSlice from './slices/APIErrorsSlice';
import userSlice from './slices/authentication/userSlice';
import postsSlice from './slices/feed/postsSlice';
import themeSlice from './slices/themeSlice';

import { logoutMiddleware } from './middlewares';

export default configureStore({
    reducer: {
        APIErrors: APIErrorsSlice,
        user: userSlice,
        posts: postsSlice,
        theme: themeSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logoutMiddleware),
});
