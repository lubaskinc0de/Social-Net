import { isAsyncThunkAction } from '@reduxjs/toolkit';
import { checkToken } from './utils';

export const logoutMiddleware =
    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
        const isPendingAction = (actionType) =>
            action.type.split('/').at(-1) === 'pending';

        if (isAsyncThunkAction(action) && isPendingAction(action.type)) {
            const { token } = getState().user;

            if (token) {
                checkToken(token);
            }
        }

        return next(action);
    };
