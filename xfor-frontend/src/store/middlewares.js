import { isAsyncThunkAction } from '@reduxjs/toolkit';
import { checkToken } from './utils';

/**
 * Middleware which call checkToken function before call all pending actions
 * @returns
 */
export const logoutMiddleware =
    ({ getState, dispatch }) =>
    (next) =>
    (action) => {
        const isPendingAction = (actionType) =>
            actionType.split('/').at(-1) === 'pending';

        if (isAsyncThunkAction(action) && isPendingAction(action.type)) {
            const { token } = getState().user;

            if (token) {
                checkToken(token, dispatch);
            }
        }

        return next(action);
    };
