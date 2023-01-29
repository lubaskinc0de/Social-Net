import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseAPIAxiosErrors } from '../../lib';
import { setAPIErrors } from '../slices/APIErrorsSlice';

import API from '../../api/feed';

export const commentLike = createAsyncThunk(
    'comments/likeComment',
    async (commentId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.commentLike(
                { comment: commentId },
                config
            );
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
    'comments/getComments',
    async (postId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user, comments: commentsState } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const { nextPage: page } = commentsState;

            if (!page) {
                return {
                    comments: [],
                    nextPage: null,
                };
            }

            const urlParameters = `page=${page}`;

            const response = await API.getComments(
                postId,
                urlParameters,
                config
            );

            const comments = response.data.results;
            const nextPage = response.data.next;

            return {
                comments,
                nextPage,
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

export const getCommentsWrapper = createAsyncThunk(
    'comments/getCommentsWrapper',
    async (arg, { dispatch, getState }) => {
        const { commentsLoading } = getState().comments;

        if (!commentsLoading) {
            dispatch(getComments(arg));
        }
    }
);
