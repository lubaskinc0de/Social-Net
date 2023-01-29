import { createSlice } from '@reduxjs/toolkit';
import { commentLike, getComments } from '../../actions/commentsActions';

import { findComment, parsePageFromNextPage } from '../../../lib/feed';

const commentsSlice = createSlice({
    name: 'commentsSlice',
    initialState: {
        likePendingComments: {},
        postComments: [],
        nextPage: 1,
        commentsLoading: null,
    },
    extraReducers: {
        // commentsLike
        [commentLike.pending](state, action) {
            const { arg: commentId } = action.meta;
            state.likePendingComments[commentId] = null;
        },

        [commentLike.fulfilled](state, action) {
            const { action: actionType, commentId } = action.payload;

            const comment = findComment(state.postComments, commentId);

            const isAdd = actionType === 'add';

            delete state.likePendingComments[commentId];

            comment.is_user_liked_comment = isAdd;
            comment.like_cnt += isAdd ? 1 : -1;
        },

        [commentLike.rejected](state, action) {
            const { id: commentId } = action.payload;
            delete state.likePendingComments[commentId];
        },

        // getComments
        [getComments.pending](state) {
            state.commentsLoading = true;
        },

        [getComments.fulfilled](state, action) {
            const { comments, nextPage } = action.payload;

            const page = nextPage ? parsePageFromNextPage(nextPage) : null;

            if (comments.length) {
                state.postComments = state.postComments.concat(comments);
            }

            state.nextPage = page;
            state.commentsLoading = false;
        },

        [getComments.rejected](state) {
            state.commentsLoading = false;
        },
    },
});

export default commentsSlice.reducer;
