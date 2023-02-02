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

export const getCommentDescendants = createAsyncThunk(
    'comments/getCommentDescendants',
    async (commentId, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user, comments: commentsState } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const { descendantsPage } = commentsState;

            const page = descendantsPage[commentId];

            console.log('page: ', page);

            if (!page) {
                return {
                    descendants: [],
                    nextPage: null,
                    commentId,
                };
            }

            const urlParameters = `page=${page}`;

            const response = await API.getCommentDescendants(
                commentId,
                config,
                urlParameters
            );

            const descendants = response.data.results;
            const nextPage = response.data.next;

            console.log('nextPage: ', nextPage);

            return {
                descendants,
                commentId,
                nextPage,
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

export const getCommentDescendantsWrapper = createAsyncThunk(
    'comments/getCommentDescendantsWrapper',
    async (commentId, { dispatch, getState }) => {
        const { descendantsLoading } = getState().comments;

        if (!descendantsLoading.hasOwnProperty(commentId)) {
            dispatch(getCommentDescendants(commentId))
        }
    }
);
