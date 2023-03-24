import { configureStore } from '@reduxjs/toolkit';

import APIErrorsSlice from './slices/APIErrorsSlice';
import userSlice from './slices/authentication/userSlice';
import postsSlice from './slices/feed/postsSlice';
import commentsSlice from './slices/feed/commentsSlice';
import themeSlice from './slices/themeSlice';
import peoplesSlice from './slices/peoples/peoplesSlice';

import { logoutMiddleware } from './middlewares';

export default configureStore({
    reducer: {
        APIErrors: APIErrorsSlice,
        user: userSlice,
        posts: postsSlice,
        comments: commentsSlice,
        theme: themeSlice,
        peoples: peoplesSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logoutMiddleware),
});
