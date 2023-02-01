import { createSlice } from '@reduxjs/toolkit';
import {
    commentLike,
    getComments,
    getCommentDescendants,
} from '../../actions/commentsActions';

import { findComment, parsePageFromNextPage } from '../../../lib/feed';

const commentsSlice = createSlice({
    name: 'commentsSlice',
    initialState: {
        likePendingComments: {},
        postComments: [],
        nextPage: 1,
        commentsLoading: null,
        descendantsPage: {},
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

        [getCommentDescendants.pending](state, action) {
            const { arg: commentId } = action.meta;
            state.descendantsPage[commentId] = 1;
        },

        [getCommentDescendants.fulfilled](state, action) {
            const { descendants, commentId } = action.payload;

            const comment = findComment(state.postComments, commentId);

            if (descendants.length) {
                if (comment.replies.length <= 2) {
                    comment.replies = descendants;
                } else {
                    comment.replies = comment.replies.concat(descendants)
                }
            }
        },
    },
});

export default commentsSlice.reducer;
