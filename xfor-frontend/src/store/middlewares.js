import { isAsyncThunkAction } from '@reduxjs/toolkit';
import { removeToken } from './slices/authentication/userSlice';
import { clearRejected } from './slices/feed/postsSlice';

import API from '../api/authentication';
// import { debounce } from '../lib';

export const logoutMiddleware =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        const isPendingAction = (actionType) =>
            action.type.split('/').at(-1) === 'pending';

        const checkToken = (token) => {
            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            };

            API.checkToken(config).catch((error) => {
                if (error.response.status === 401) {
                    dispatch(removeToken());
                    dispatch(clearRejected());
                }
            });
        };

        if (isAsyncThunkAction(action) && isPendingAction(action.type)) {
            const { token } = getState().user;

            if (token) {
                checkToken(token);
            }
        }

        return next(action);
    };
