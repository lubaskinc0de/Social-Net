import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseAPIAxiosErrors } from '../../lib';
import { setAPIErrors } from '../slices/APIErrorsSlice';

import API from '../../api/feed';

export const commentLike = createAsyncThunk(
    'posts/likeComment',
    async (commentId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.commentLike({ comment: commentId }, config);
            const action = response.data.action;

            return {
                commentId,
                action,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                commentId,
            });
        }
    }
);

export const getComments = createAsyncThunk(
    'posts/getComments',
    async (postId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.getComments(postId, config);
            const comments = response.data.results;

            return {
                comments,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue();
        }
    }
);