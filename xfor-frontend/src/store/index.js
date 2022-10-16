import {configureStore} from '@reduxjs/toolkit';
import APIErrorsSlice from './slices/authentication/APIErrorsSlice';
import userSlice from './slices/authentication/userSlice';

export default configureStore({
    reducer: {
        APIErrors: APIErrorsSlice,
        user: userSlice,
    },
});
